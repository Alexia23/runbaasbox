package com.baasbox.controllers;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.baasbox.controllers.actions.filters.*;
import com.baasbox.BBConfiguration;
import com.baasbox.dao.exception.SqlInjectionException;
import com.baasbox.dao.exception.UserAlreadyExistsException;
import com.baasbox.db.DbHelper;
import com.baasbox.enumerations.DefaultRoles;
import com.baasbox.exception.InvalidAppCodeException;
import com.baasbox.exception.InvalidJsonException;
import com.baasbox.security.SessionKeys;
import com.baasbox.security.SessionTokenProvider;
import com.baasbox.service.user.UserService;
import com.baasbox.util.BBJson;
import com.baasbox.util.JSONFormats;
import com.baasbox.util.QueryParams;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import com.orientechnologies.orient.core.db.record.ODatabaseRecordTx;
import com.orientechnologies.orient.core.exception.OSecurityAccessException;
import com.orientechnologies.orient.core.record.impl.ODocument;

import me.chanjar.weixin.common.exception.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpServiceImpl;
import me.chanjar.weixin.mp.bean.result.WxMpOAuth2AccessToken;
import me.chanjar.weixin.mp.bean.result.WxMpUser;
import play.Logger;
import play.Play;
import play.cache.Cache;
import play.libs.F;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.With;

public class Wechat extends Controller {
	static String prepareResponseToJson(ODocument doc){
		response().setContentType("application/json");
		return JSONFormats.prepareResponseToJson(doc,JSONFormats.Formats.USER);
	}
	
	@With ({AdminCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class})
	@BodyParser.Of(BodyParser.Json.class)
	public static F.Promise<Result> signUp(String username, String password, JsonNode privateAttributes) throws JsonProcessingException, IOException {
		if (Logger.isTraceEnabled())
			Logger.trace("Method Start");

		String appcode = BBConfiguration.getAPPCODE();
		
		return F.Promise.promise(DbHelper.withDbFromContext(ctx(),()->{
			//try to signup new user
			ODocument profile = null;
			try {
				UserService.signUp(username, password, new Date(), DefaultRoles.REGISTERED_USER.toString(), null,privateAttributes,null,null,false);
				//due to issue 412, we have to reload the profile
				profile = UserService.getUserProfilebyUsername(username);
			} catch (InvalidJsonException e){
				if (Logger.isDebugEnabled()) Logger.debug("wechatLogin-signUp", e);
				return badRequest("profile部分是无效的JSON对象");
			} catch (UserAlreadyExistsException e){
				if (Logger.isDebugEnabled()) Logger.debug("wechatLogin-signUp", e);
				return badRequest(username + " 已经存在");
			} catch (Throwable e){
				Logger.warn("wechatLogin", e);
				if (Play.isDev()) return internalServerError(ExceptionUtils.getFullStackTrace(e));
				else return internalServerError(e.getMessage());
			}
			if (Logger.isTraceEnabled()) Logger.trace("Method End");
			ImmutableMap<SessionKeys, ? extends Object> sessionObject = SessionTokenProvider.getSessionTokenProvider().setSession(appcode, username, password);
			response().setHeader(SessionKeys.TOKEN.toString(), (String) sessionObject.get(SessionKeys.TOKEN));
			
			String result=prepareResponseToJson(profile);
			ObjectMapper mapper = new ObjectMapper();
			result = result.substring(0,result.lastIndexOf("}")) + ",\""+SessionKeys.TOKEN.toString()+"\":\""+ (String) sessionObject.get(SessionKeys.TOKEN)+"\"}";
			JsonNode jn = mapper.readTree(result);

			return created(jn);
		}));
	}
	
	@With ({AdminCredentialWrapFilterAsync.class, ConnectToDBFilterAsync.class})
	@BodyParser.Of(BodyParser.Json.class)
	public static F.Promise<Result> wechatlogin(String code, String state) {
		if (Logger.isTraceEnabled()) Logger.trace("Method Start");
			
		try {
			final String appcode = BBConfiguration.getAPPCODE();
			DbHelper.open(appcode, BBConfiguration.getBaasBoxAdminUsername(), BBConfiguration.getBaasBoxAdminPassword());
			
			// 先通过code获取openId
			WxMpServiceImpl wxMpService = (WxMpServiceImpl)Cache.get("wxService");
			WxMpOAuth2AccessToken oAuth2AccessToken = wxMpService.oauth2getAccessToken(code);
			final String openId = oAuth2AccessToken.getOpenId();
			final String defaultPassword = BBConfiguration.getWechatOpenidPassword();			
			
			// 再判断openId用户是否存在，存在则登录，不存在则自动注册
			QueryParams criteria = QueryParams.getInstance();
			criteria.where("user.name='" + openId + "'");
			
			try{
				List<ODocument> users = UserService.getUsers(criteria);
				if (users.size() > 0) { //用户已存在，直接登录
					if (openId.equalsIgnoreCase(BBConfiguration.getBaasBoxAdminUsername())
							||
							openId.equalsIgnoreCase(BBConfiguration.getBaasBoxUsername())
							) return F.Promise.pure(forbidden(openId + " cannot login"));
					
					return F.Promise.promise(()->{
						String user;
						try (ODatabaseRecordTx db = DbHelper.open(appcode,openId,defaultPassword)){
							user = prepareResponseToJson(UserService.getCurrentUser());
							ImmutableMap<SessionKeys, ? extends Object> sessionObject = SessionTokenProvider.getSessionTokenProvider().setSession(appcode, openId, defaultPassword);
							response().setHeader(SessionKeys.TOKEN.toString(), (String) sessionObject.get(SessionKeys.TOKEN));

							ObjectMapper mapper = BBJson.mapper();
							user = user.substring(0,user.lastIndexOf("}")) + ",\""+SessionKeys.TOKEN.toString()+"\":\""+ (String) sessionObject.get(SessionKeys.TOKEN)+"\"}";
							JsonNode jn = mapper.readTree(user);
							return ok(jn);
						} catch (OSecurityAccessException e){
							if (Logger.isDebugEnabled()) Logger.debug("wechatLogin: " +  e.getMessage());
							return unauthorized("用户 " + openId + " 未登录");
						} catch (InvalidAppCodeException e) {
							if (Logger.isDebugEnabled()) Logger.debug("UserLogin: " + e.getMessage());
							return badRequest("用户 " + openId + " 未登录");
						}
					});
				} else { //用户不存在，自动注册
					// 获取微信用户信息
//					WxMpUser userInfo = wxMpService.oauth2getUserInfo(oAuth2AccessToken, "zh_CN");
					WxMpUser userInfo = wxMpService.userInfo(openId, "zh_CN");
					String nickName = userInfo.getNickname(); //昵称
					String headImgUrl = userInfo.getHeadImgUrl(); //头像url
					String userInfoJson = "{\"nickName\":\"" + nickName + "\",\"headImgUrl\":\"" + headImgUrl + "\"}";
					try {
						JsonNode privateAttributes = new ObjectMapper().readTree(userInfoJson);						
						return signUp(openId, defaultPassword, privateAttributes);
					} catch (IOException e1) {
						if (Logger.isDebugEnabled()) Logger.debug("wechatLogin-SignUp", e1);
						return F.Promise.pure(badRequest("注册失败！"));
					}					
				}
			}catch (SqlInjectionException e ){
				if (Logger.isDebugEnabled()) Logger.debug("wechatLogin", e);
				return F.Promise.pure(badRequest("获取用户信息错误！"));
			}
		} catch (WxErrorException e1) {
			if (Logger.isDebugEnabled()) Logger.debug("wechatLogin", e1);
			return F.Promise.pure(badRequest("获取微信信息错误！"));
		} catch (Throwable e){
			Logger.warn("wechatLogin", e);
			if (Play.isDev()) return F.Promise.pure(internalServerError(ExceptionUtils.getFullStackTrace(e)));
			else return F.Promise.pure(internalServerError(e.getMessage()));
		} finally {
			DbHelper.close(DbHelper.getConnection());
		}
	}
}
