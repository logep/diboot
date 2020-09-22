package com.diboot.iam.util;

import com.diboot.core.util.BeanUtils;
import com.diboot.core.util.S;
import com.diboot.core.util.V;
import com.diboot.iam.entity.IamFrontendPermission;
import com.diboot.iam.vo.IamRoleVO;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * IAM相关辅助类
 *
 * @author mazc@dibo.ltd
 * @version v2.0
 * @date 2020/06/28
 */
@Slf4j
public class IamHelper {

    /***
     * 构建请求参数Map
     * @return
     */
    public static Map<String, Object> buildParamsMap(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        Enumeration paramNames = request.getParameterNames();
        try{
            while (paramNames.hasMoreElements()){
                String paramName = (String) paramNames.nextElement();
                String[] values = request.getParameterValues(paramName);
                if(V.notEmpty(values)){
                    if(values.length == 1){
                        if(V.notEmpty(values[0])){
                            String paramValue = java.net.URLDecoder.decode(values[0], com.diboot.core.config.Cons.CHARSET_UTF8);
                            result.put(paramName, paramValue);
                        }
                    }
                    else{
                        String[] valueArray = new String[values.length];
                        for(int i=0; i<values.length; i++){
                            valueArray[i] = java.net.URLDecoder.decode(values[i], com.diboot.core.config.Cons.CHARSET_UTF8);
                        }
                        result.put(paramName, valueArray);
                    }
                }
            }
        }
        catch (Exception e){
            log.warn("构建请求参数异常", e);
        }
        return result;
    }

    /**
     * 构建role-permission角色权限数据格式(合并role等)，用于前端适配
     * @param roleVOList
     * @return
     */
    public static IamRoleVO buildRoleVo4FrontEnd(List<IamRoleVO> roleVOList) {
        if (V.isEmpty(roleVOList)){
            return null;
        }
        // 对RoleList做聚合处理，以适配前端
        List<String> nameList = new ArrayList<>();
        List<String> codeList = new ArrayList<>();
        List<IamFrontendPermission> allPermissionList = new ArrayList<>();
        roleVOList.forEach(vo -> {
            nameList.add(vo.getName());
            codeList.add(vo.getCode());
            if (V.notEmpty(vo.getPermissionList())){
                allPermissionList.addAll(vo.getPermissionList());
            }
        });
        // 对permissionList进行去重
        List permissionList = BeanUtils.distinctByKey(allPermissionList, IamFrontendPermission::getId);
        IamRoleVO roleVO = new IamRoleVO();
        roleVO.setName(S.join(nameList));
        roleVO.setCode(S.join(codeList));
        roleVO.setPermissionList(permissionList);

        return roleVO;
    }

}