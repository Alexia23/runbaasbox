/*
     Copyright 2012-2013 
     Claudio Tesoriero - c.tesoriero-at-baasbox.com

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
package com.baasbox.controllers;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.List;

import com.baasbox.util.ErrorToResult;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.commons.lang3.StringUtils;

import play.Logger;
import play.libs.F;
import play.libs.F.Promise;
import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Http.Context;
import play.mvc.Result;
import play.mvc.With;

import com.baasbox.controllers.actions.exceptions.RidNotFoundException;
import com.baasbox.controllers.actions.filters.ConnectToDBFilterAsync;
import com.baasbox.controllers.actions.filters.ExtractQueryParameters;
import com.baasbox.controllers.actions.filters.UserCredentialWrapFilterAsync;
import com.baasbox.controllers.actions.filters.UserOrAnonymousCredentialsFilterAsync;
import com.baasbox.dao.PermissionJsonWrapper;
import com.baasbox.dao.PermissionsHelper;
import com.baasbox.dao.exception.DocumentNotFoundException;
import com.baasbox.dao.exception.InvalidCollectionException;
import com.baasbox.dao.exception.InvalidCriteriaException;
import com.baasbox.dao.exception.InvalidModelException;
import com.baasbox.dao.exception.UpdateOldVersionException;
import com.baasbox.db.DbHelper;
import com.baasbox.enumerations.Permissions;
import com.baasbox.exception.AclNotValidException;
import com.baasbox.exception.InvalidJsonException;
import com.baasbox.exception.RoleNotFoundException;
import com.baasbox.exception.UserNotFoundException;
import com.baasbox.service.query.MissingNodeException;
import com.baasbox.service.query.PartsLexer;
import com.baasbox.service.query.PartsLexer.Part;
import com.baasbox.service.query.PartsLexer.PartValidationException;
import com.baasbox.service.query.PartsParser;
import com.baasbox.service.storage.DocumentService;
import com.baasbox.util.IQueryParametersKeys;
import com.baasbox.util.JSONFormats;
import com.baasbox.util.JSONFormats.Formats;
import com.baasbox.util.QueryParams;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.orientechnologies.orient.core.exception.ODatabaseException;
import com.orientechnologies.orient.core.exception.OSecurityAccessException;
import com.orientechnologies.orient.core.exception.OSecurityException;
import com.orientechnologies.orient.core.record.impl.ODocument;


public class Document extends Controller {

    private static final String JSON_BODY_NULL = "The body payload cannot be empty. Hint: put in the request header Content-Type: application/json";


    static String prepareResponseToJson(ODocument doc) {
        response().setContentType("application/json");
        Formats format;
        try {
            DbHelper.filterOUserPasswords(true);
            if (BooleanUtils.toBoolean(Http.Context.current().request().getQueryString("withAcl"))) {
                format = JSONFormats.Formats.DOCUMENT_WITH_ACL;
                return JSONFormats.prepareResponseToJson(doc, format, true);
            } else {
                format = JSONFormats.Formats.DOCUMENT;
                return JSONFormats.prepareResponseToJson(doc, format, false);
            }
        } finally {
            DbHelper.filterOUserPasswords(false);
        }
    }

    private static String prepareResponseToJson(List<ODocument> listOfDoc) throws IOException {
        response().setContentType("application/json");
        Formats format;
        try {
            DbHelper.filterOUserPasswords(true);
            if (BooleanUtils.toBoolean(Http.Context.current().request().getQueryString("withAcl"))) {
                format = JSONFormats.Formats.DOCUMENT_WITH_ACL;
                return JSONFormats.prepareResponseToJson(listOfDoc, format, true);
            } else {
                format = JSONFormats.Formats.DOCUMENT;
                return JSONFormats.prepareResponseToJson(listOfDoc, format);
            }
        } finally {
            DbHelper.filterOUserPasswords(false);
        }
    }


    /**
     * @param collectionName
     * @return the number of documents in the collection
     */
    @With({UserOrAnonymousCredentialsFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    public static Promise<Result> getCount(String collectionName) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        if (Logger.isTraceEnabled()) Logger.trace("collectionName: " + collectionName);

        //long count;
        Context ctx = Http.Context.current.get();
        QueryParams criteria = (QueryParams) ctx.args.get(IQueryParametersKeys.QUERY_PARAMETERS);

        return F.Promise.promise(DbHelper.withDbFromContext(ctx, () -> {
            long count = DocumentService.getCount(collectionName, criteria);
            if (Logger.isTraceEnabled()) Logger.trace("count: " + count);
            return ok(Json.newObject().put("count", count));
        })).recover(ErrorToResult
                .when(InvalidCollectionException.class,
                        e -> {
                            if (Logger.isDebugEnabled())
                                Logger.debug(collectionName + " is not a valid collection name");
                            return notFound(collectionName + " is not a valid collection name");
                        }
                )
                .when(Exception.class,
                        e -> {
                            Logger.error(ExceptionUtils.getFullStackTrace(e));
                            return internalServerError(e.getMessage());
                        }));

    }

    @With({UserOrAnonymousCredentialsFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    public static Promise<Result> getDocuments(String collectionName) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        if (Logger.isTraceEnabled()) Logger.trace("collectionName: " + collectionName);

        Context ctx = Http.Context.current.get();
        QueryParams criteria = (QueryParams) ctx.args.get(IQueryParametersKeys.QUERY_PARAMETERS);

        return F.Promise.promise(DbHelper.withDbFromContext(ctx, () -> {
            List<ODocument> result;
            String ret = "{[]}";
            result = DocumentService.getDocuments(collectionName, criteria);
            if (Logger.isTraceEnabled()) Logger.trace("count: " + result.size());
            ret = prepareResponseToJson(result);
            return ok(ret);

        })).recover(ErrorToResult
                .when(InvalidCollectionException.class, e -> {
                    if (Logger.isDebugEnabled()) Logger.debug(collectionName + " is not a valid collection name");
                    return notFound(collectionName + " is not a valid collection name");
                })
                .when(IOException.class,
                        e -> internalServerError(ExceptionUtils.getFullStackTrace(e))
                )
                .when(Exception.class,
                        e -> {
                            Logger.error(ExceptionUtils.getFullStackTrace(e));
                            return internalServerError(e.getMessage());
                        }));

    }

    @With({UserOrAnonymousCredentialsFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    public static Promise<Result> queryDocument(String collectionName, String id, boolean isUUID, String parts) {
        if (parts == null || StringUtils.isEmpty(parts)) {
            return getDocument(collectionName, id, isUUID);
        } else {
            if (Logger.isTraceEnabled()) Logger.trace("Method Start");
            if (Logger.isTraceEnabled()) Logger.trace("collectionName: " + collectionName);
            if (Logger.isTraceEnabled()) Logger.trace("rid: " + id);

            String[] tokens = parts.split("/");
            List<Part> queryParts = new ArrayList<Part>();
            PartsLexer pp = new PartsLexer();
            for (int i = 0; i < tokens.length; i++) {
                try {
                    String decoded = URLDecoder.decode(tokens[i], "UTF-8");
                    queryParts.add(pp.parse(decoded, i + 1));
                } catch (UnsupportedEncodingException e) {
                    return Promise.pure(badRequest("Unable to decode parts"));
                } catch (PartValidationException e) {
                    return Promise.pure(badRequest(e.getMessage() == null ? "" : e.getMessage()));
                }
            }
            final PartsParser partsParser = new PartsParser(queryParts);

            return F.Promise.promise(DbHelper.withDbFromContext(ctx(),
                    () -> {
                        String rid = DocumentService.getRidByString(id, isUUID);
                        ODocument doc = DocumentService.get(collectionName, rid, partsParser);
                        return doc == null ? notFound() : ok(prepareResponseToJson(doc));
                    })).recover(ErrorToResult
                    .when(IllegalArgumentException.class,
                            e -> badRequest(e.getMessage() != null ? e.getMessage() : ""))
                    .when(InvalidCollectionException.class,
                            e -> notFound(collectionName + " is not a valid collection name"))
                    .when(ODatabaseException.class,
                            e -> notFound(id + " not found. Do you have the right to read it?"))
                    .when(DocumentNotFoundException.class,
                            e -> notFound(id + " not found"))
                    .when(RidNotFoundException.class,
                            e -> notFound(e.getMessage()))
                    .when(InvalidCriteriaException.class,
                            e -> badRequest(e.getMessage() != null ? e.getMessage() : "")))
                    .map(r -> {
                        if (Logger.isTraceEnabled()) Logger.trace("Method End");
                        return r;
                    });
        }
    }

    @With({UserOrAnonymousCredentialsFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    public static Promise<Result> getDocument(String collectionName, String id, boolean isUUID) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        if (Logger.isTraceEnabled()) Logger.trace("collectionName: " + collectionName);
        if (Logger.isTraceEnabled()) Logger.trace("rid: " + id);

        return F.Promise.promise(DbHelper.withDbFromContext(ctx(), () -> {
            String rid = DocumentService.getRidByString(id, isUUID);
            ODocument doc = DocumentService.get(collectionName, rid);
            return doc == null ? notFound() : ok(prepareResponseToJson(doc));
        })).recover(ErrorToResult

                .when(IllegalArgumentException.class,
                        e -> badRequest(e.getMessage() != null ? e.getMessage() : ""))
                .when(InvalidCollectionException.class,
                        e -> notFound(collectionName + " is not a valid collection name"))
                .when(InvalidModelException.class,
                        e -> notFound("Document " + id + " is not a " + collectionName + " document"))
                .when(ODatabaseException.class,
                        e -> notFound(id + " not found. Do you have the right to read it?"))
                .when(DocumentNotFoundException.class,
                        e -> notFound(id + " not found"))
                .when(RidNotFoundException.class,
                        e -> notFound(e.getMessage())))

                .map(r -> {
                    if (Logger.isTraceEnabled()) Logger.trace("Method End");
                    return r;
                });
    }

    @With({UserCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    public static Promise<Result> getDocumentByRid(String rid) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        final String orid = "#" + rid;
        if (Logger.isTraceEnabled()) Logger.trace("rid: " + orid);
        //ODocument doc;
        return Promise.promise(DbHelper.withDbFromContext(ctx(),
                () -> {
                    ODocument doc = DocumentService.get(orid);
                    if (doc == null) {
                        return notFound();
                    } else {
                        return ok(prepareResponseToJson(doc));
                    }
                })).recover(ErrorToResult
                .when(IllegalArgumentException.class,
                        e -> badRequest(e.getMessage()))
                .when(ODatabaseException.class,
                        e -> notFound(orid + " unknown")))
                .map(r -> {
                            if (Logger.isTraceEnabled()) Logger.trace("Method End");
                            return r;
                        }
                );
    }

    @With({UserCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    @BodyParser.Of(BodyParser.Json.class)
    public static Promise<Result> createDocument(String collection) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        Http.RequestBody body = request().body();
        Context ctx = Http.Context.current.get();

        return F.Promise.promise(() -> {
            ODocument document = null;
            try {
                DbHelper.openFromContext(ctx);
                JsonNode bodyJson = body.asJson();
                if (bodyJson == null) return badRequest(JSON_BODY_NULL);
                if (!bodyJson.isObject()) throw new InvalidJsonException("The body must be an JSON object");
                if (Logger.isTraceEnabled()) Logger.trace("creating document in collection: " + collection);
                if (Logger.isTraceEnabled()) Logger.trace("bodyJson: " + bodyJson);
                document = DocumentService.create(collection, (ObjectNode) bodyJson);
                if (Logger.isTraceEnabled())
                    Logger.trace("Document created: " + document.getRecord().getIdentity());
                return ok(prepareResponseToJson(document));
            } catch (InvalidCollectionException e) {
                return notFound(e.getMessage());
            } catch (InvalidJsonException e) {
                return badRequest("JSON not valid. HINT: check if it is not just a JSON collection ([..]), a single element ({\"element\"}) or you are trying to pass a @version:null field");
            } catch (UpdateOldVersionException e) {
                return badRequest(ExceptionUtils.getMessage(e));
            } catch (InvalidModelException e) {
                return badRequest("ACL fields are not valid: " + e.getMessage());
            } catch (Throwable e) {
                Logger.error(ExceptionUtils.getFullStackTrace(e));
                return internalServerError(ExceptionUtils.getFullStackTrace(e));
            } finally {
                DbHelper.close(DbHelper.getConnection());
            }
        });
    }

    @With({UserCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    @BodyParser.Of(BodyParser.Json.class)
    public static Promise<Result> updateDocument(String collectionName, String id, boolean isUUID) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        Http.RequestBody body = request().body();
        JsonNode bodyJson = body.asJson();
        if (bodyJson == null) {
            return Promise.pure(badRequest(JSON_BODY_NULL));
        }
        if (bodyJson.get("@version") != null && !bodyJson.get("@version").isInt()) {
            return Promise.pure(badRequest("@version field must be an Integer"));
        }
        if (!bodyJson.isObject()) {
            return Promise.pure(badRequest("JSON not valid. HINT: check if it is not just a JSON collection ([..]), a single element ({\"element\"}) or you are trying to pass a @version:null field"));
        }

        if (Logger.isTraceEnabled()) Logger.trace("updateDocument collectionName: " + collectionName);
        if (Logger.isTraceEnabled()) Logger.trace("updateDocument id: " + id);

        return Promise.promise(DbHelper.withDbFromContext(ctx(),
                () -> {
                    String rid = DocumentService.getRidByString(id, isUUID);
                    ODocument document = DocumentService.update(collectionName, rid, (ObjectNode) bodyJson);
                    if (document == null) {
                        return notFound("Document " + id + " was not found in the collection " + collectionName);
                    } else {
                        return ok(prepareResponseToJson(document));
                    }
                }))
                .recover(ErrorToResult
                        .when(DocumentNotFoundException.class,
                                e -> notFound("Document " + id + " not found"))
                        .when(AclNotValidException.class,
                                e -> badRequest("ACL fields are not valid: " + e.getMessage()))
                        .when(UpdateOldVersionException.class,
                                e -> status(CustomHttpCode.DOCUMENT_VERSION.getBbCode(),
                                        "You are attempting to update an older version of the document. Your document version is "
                                                + e.getVersion1() + ", the stored document has version "
                                                + e.getVersion2()))
                        .when(RidNotFoundException.class,
                                e -> notFound("id " + id + " not found"))
                        .when(InvalidCollectionException.class,
                                e -> notFound(collectionName + " is not a valid collection name"))
                        .when(InvalidModelException.class,
                                e -> notFound(id + " is not a valid belongs to " + collectionName))
                        .when(InvalidParameterException.class,
                                e -> badRequest(id + " is not a document"))
                        .when(IllegalArgumentException.class,
                                e -> badRequest(id + " is not a document"))
                        .when(ODatabaseException.class,
                                e -> notFound(id + " unknown"))
                        .when(OSecurityException.class,
                                e -> forbidden("You have not the right to modify " + id))
                        .when(Throwable.class,
                                e -> {
                                    Logger.error(ExceptionUtils.getFullStackTrace(e));
                                    return internalServerError(ExceptionUtils.getFullStackTrace(e));
                                }))
                .map(r -> {
                    if (Logger.isTraceEnabled()) Logger.trace("Method End");
                    return r;
                });
    }

    @With({UserCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    @BodyParser.Of(BodyParser.Json.class)
    public static Promise<Result> updateDocumentWithParts(String collectionName, String id, boolean isUUID, String parts) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        Http.RequestBody body = request().body();
        JsonNode bodyJson = body.asJson();
        if (Logger.isTraceEnabled()) Logger.trace("updateDocument collectionName: " + collectionName);
        if (Logger.isTraceEnabled()) Logger.trace("updateDocument id: " + id);

        if (bodyJson == null) {
            return Promise.pure(badRequest(JSON_BODY_NULL));
        }
        if (!bodyJson.isObject()) {
            return Promise.pure(badRequest("The body must be an JSON object"));
        }
        if (bodyJson.get("data") == null) {
            return Promise.pure(badRequest("The body payload must have a data field. Hint: modify your content to have a \"data\" field"));
        }
        PartsLexer lexer = new PartsLexer();
        List<Part> objParts = new ArrayList<Part>();
        String[] tokens = parts.split("/");
        for (int i = 0; i < tokens.length; i++) {
            try {
                String p = java.net.URLDecoder.decode(tokens[i], "UTF-8");
                objParts.add(lexer.parse(p, i + 1));
            } catch (PartValidationException pve) {
                return Promise.pure(badRequest(pve.getMessage()));
            } catch (Exception e) {
                return Promise.pure(badRequest("Unable to parse document parts"));
            }
        }
        final PartsParser pp = new PartsParser(objParts);
        return Promise.promise(DbHelper.withDbFromContext(ctx(),
                () -> {
                    String rid = DocumentService.getRidByString(id, isUUID);
                    ODocument document = com.baasbox.service.storage.DocumentService.update(collectionName, rid, (ObjectNode) bodyJson, pp);
                    if (document == null) {
                        return notFound("Document " + id + " was not found in the collection " + collectionName);
                    } else {
                        return ok(prepareResponseToJson(document));
                    }
                })).recover(ErrorToResult
                .when(MissingNodeException.class,
                        e -> notFound(e.getMessage()))
                .when(InvalidCollectionException.class,
                        e -> notFound(collectionName + " is not a valid collection name"))
                .when(InvalidModelException.class,
                        e -> notFound(id + " is not a valid belongs to " + collectionName))
                .when(InvalidParameterException.class,
                        e -> notFound("Cannot find the document " + id + " HINT: have you the permission to access this document?"))
                .when(IllegalArgumentException.class,
                        e -> badRequest(id + " is not a document"))
                .when(ODatabaseException.class,
                        e -> notFound(id + " unknown"))
                .when(OSecurityException.class,
                        e -> forbidden("You have not the right to modify the document " + id))
                .when(RidNotFoundException.class,
                        e -> notFound(e.getMessage()))
                .when(Throwable.class,
                        e -> {
                            Logger.error(ExceptionUtils.getFullStackTrace(e));
                            return internalServerError(ExceptionUtils.getFullStackTrace(e));
                        }))
                .map(r -> {
                    if (Logger.isTraceEnabled()) Logger.trace("Method End");
                    return r;
                });
    }

    @With({UserCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    public static Promise<Result> deleteDocument(String collectionName, String id, boolean isUUID) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        if (Logger.isTraceEnabled()) Logger.trace("deleteDocument collectionName: " + collectionName);
        if (Logger.isTraceEnabled()) Logger.trace("deleteDocument rid: " + id);

        return Promise.promise(DbHelper.withDbFromContext(ctx(),
                () -> {
                    String rid = DocumentService.getRidByString(id, isUUID);
                    DocumentService.delete(collectionName, rid);
                    return ok("");
                })).recover(ErrorToResult
                .when(RidNotFoundException.class,
                        e -> notFound("id  " + id + " not found"))
                .when(OSecurityException.class,
                        e -> forbidden("You have not the right to delete " + id))
                .when(InvalidCollectionException.class,
                        e -> notFound(e.getMessage()))
                .when(Throwable.class,
                        e -> internalServerError(e.getMessage())))
                .map(r -> {
                    if (Logger.isTraceEnabled()) Logger.trace("Method End");
                    return r;
                });
    }

    @With({UserCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    public static Promise<Result> grantToUser(String collectionName, String rid, String username, String action, boolean isUUID) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        if (Logger.isTraceEnabled()) Logger.trace("grant collectionName: " + collectionName);
        if (Logger.isTraceEnabled()) Logger.trace("grant rid: " + rid);
        if (Logger.isTraceEnabled()) Logger.trace("grant username: " + username);
        if (Logger.isTraceEnabled()) Logger.trace("grant action: " + action);
        Promise<Result> res = grantOrRevokeToUser(collectionName, rid, username, action, true, isUUID);
        if (Logger.isTraceEnabled()) Logger.trace("Method End");
        return res;
    }

    @With({UserCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    public static Promise<Result> revokeToUser(String collectionName, String rid, String username, String action, boolean isUUID) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        if (Logger.isTraceEnabled()) Logger.trace("grant collectionName: " + collectionName);
        if (Logger.isTraceEnabled()) Logger.trace("grant rid: " + rid);
        if (Logger.isTraceEnabled()) Logger.trace("grant username: " + username);
        if (Logger.isTraceEnabled()) Logger.trace("grant action: " + action);
        Promise<Result> res = grantOrRevokeToUser(collectionName, rid, username, action, false, isUUID);
        if (Logger.isTraceEnabled()) Logger.trace("Method End");
        return res;
    }

    @With({UserCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    public static Promise<Result> grantToRole(String collectionName, String rid, String rolename, String action, boolean isUUID) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        if (Logger.isTraceEnabled()) Logger.trace("grant collectionName: " + collectionName);
        if (Logger.isTraceEnabled()) Logger.trace("grant rid: " + rid);
        if (Logger.isTraceEnabled()) Logger.trace("grant rolename: " + rolename);
        if (Logger.isTraceEnabled()) Logger.trace("grant action: " + action);
        Promise<Result> res = grantOrRevokeToRole(collectionName, rid, rolename, action, true, isUUID);
        if (Logger.isTraceEnabled()) Logger.trace("Method End");
        return res;
    }

    @With({UserCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    public static Promise<Result> revokeToRole(String collectionName, String rid, String rolename, String action, boolean isUUID) {
        if (Logger.isTraceEnabled()) Logger.trace("Method Start");
        if (Logger.isTraceEnabled()) Logger.trace("grant collectionName: " + collectionName);
        if (Logger.isTraceEnabled()) Logger.trace("grant rid: " + rid);
        if (Logger.isTraceEnabled()) Logger.trace("grant rolename: " + rolename);
        if (Logger.isTraceEnabled()) Logger.trace("grant action: " + action);
        Promise<Result> res = grantOrRevokeToRole(collectionName, rid, rolename, action, false, isUUID);
        if (Logger.isTraceEnabled()) Logger.trace("Method End");
        return res;
    }

    private static Promise<Result> grantOrRevokeToUser(String collectionName, String id,
                                                       String username, String action, boolean grant, boolean isUUID) {
        return Promise.promise(DbHelper.withDbFromContext(ctx(),
                () -> {
                    String rid = DocumentService.getRidByString(id, isUUID);
                    Permissions permission = PermissionsHelper.permissionsFromString.get(action.toLowerCase());
                    if (permission == null) {
                        return badRequest(action + " is not a valid action");
                    }
                    if (grant) {
                        DocumentService.grantPermissionToUser(collectionName, rid, permission, username);
                    } else {
                        DocumentService.revokePermissionToUser(collectionName, rid, permission, username);
                    }
                    return ok();
                })).recover(ErrorToResult
                .when(RidNotFoundException.class,
                        e -> notFound("id " + id + " not found"))
                .when(IllegalArgumentException.class,
                        e -> badRequest(e.getMessage()))
                .when(UserNotFoundException.class,
                        e -> notFound("user " + username + " not found"))
                .when(InvalidCollectionException.class,
                        e -> notFound("collection " + collectionName + " not found"))
                .when(InvalidModelException.class,
                        e -> badRequest(id + " does not belong to the " + collectionName + " collection"))
                .when(DocumentNotFoundException.class,
                        e -> notFound("document " + id + " not found. Hint: has the user the correct rights on it?"))
                .when(OSecurityAccessException.class,
                        e -> forbidden())
                .when(OSecurityException.class,
                        e -> forbidden())
                .when(Throwable.class,
                        e -> internalServerError(e.getMessage())));
    }//grantOrRevokeToUser

    private static Promise<Result> grantOrRevokeToRole(String collectionName, String id,
                                                       String rolename, String action, boolean grant, boolean isUUID) {

        return Promise.promise(DbHelper.withDbFromContext(ctx(),
                () -> {
                    Permissions permission = PermissionsHelper.permissionsFromString.get(action.toLowerCase());
                    if (permission == null) return badRequest(action + " is not a valid action");
                    //converts uuid in rid
                    String rid = DocumentService.getRidByString(id, isUUID);
                    if (grant) {
                        DocumentService.grantPermissionToRole(collectionName, rid, permission, rolename);
                    } else {
                        DocumentService.revokePermissionToRole(collectionName, rid, permission, rolename);
                    }
                    return ok();
                })).recover(ErrorToResult
                .when(RidNotFoundException.class,
                        e -> notFound("id " + id + " no found"))
                .when(IllegalArgumentException.class,
                        e -> badRequest(e.getMessage()))
                .when(RoleNotFoundException.class,
                        e -> notFound("role " + rolename + " not found"))
                .when(InvalidCollectionException.class,
                        e -> notFound("collection " + collectionName + " not found"))
                .when(InvalidModelException.class,
                        e -> badRequest(id + " does not belong to the " + collectionName + " collection"))
                .when(DocumentNotFoundException.class,
                        e -> notFound("document " + id + " not found. Hint: has the user the correct rights on it?"))
                .when(OSecurityAccessException.class,
                        e -> forbidden())
                .when(OSecurityException.class,
                        e -> forbidden())
                .when(Throwable.class,
                        e -> internalServerError(e.getMessage())));
    }//grantOrRevokeToRole


    @With({UserCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class, ExtractQueryParameters.class})
    @BodyParser.Of(BodyParser.Json.class)
    public static Promise<Result> updateAcl(String collectionName, String uuid) {
        Http.RequestBody body = request().body();
        JsonNode jsonNode = body.asJson();
        if (jsonNode == null) return Promise.pure(badRequest(JSON_BODY_NULL));
        if (!jsonNode.isObject()) return Promise.pure(badRequest("Missing body"));
        final ObjectNode perm = (ObjectNode) jsonNode;

        try {
            PermissionJsonWrapper acl = new PermissionJsonWrapper(perm, true);

            return Promise.promise(DbHelper.withDbFromContext(ctx(),
                    () -> {
                        ODocument doc = DocumentService.setAcl(collectionName, uuid, acl);
                        return ok(prepareResponseToJson(doc));
                    }))
                    .recover(ErrorToResult
                            .when(IllegalArgumentException.class,
                                    e -> badRequest(e.getMessage()))
                            .when(InvalidCollectionException.class,
                                    e -> notFound("collection " + collectionName + " not found"))
                            .when(InvalidModelException.class,
                                    e -> badRequest(uuid + " does not belong to the " + collectionName + " collection"))
                            .when(DocumentNotFoundException.class,
                                    e -> notFound("document " + uuid + " not found. Hint: has the user the correct rights on it?"))
                            .when(OSecurityAccessException.class,
                                    e -> forbidden())
                            .when(OSecurityException.class,
                                    e -> forbidden())
                            .when(Throwable.class,
                                    e -> internalServerError(ExceptionUtils.getFullStackTrace(e))));
        } catch (AclNotValidException e) {
            return Promise.pure(badRequest("ACL fields are not valid: " + e.getMessage()));
        }
    }

}