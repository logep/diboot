/*
 * Copyright (c) 2015-2020, www.dibo.ltd (service@dibo.ltd).
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * <p>
 * https://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
package com.diboot.core.protect.encryptor;

/**
 * 加解密接口
 *
 * @author : uu
 * @version : v1.0
 * @date 2021/7/13  09:45
 */
public interface IEncryptStrategy {

    /**
     * 加密
     *
     * @param content 内容
     * @return 密文
     */
    String encrypt(String content);

    /**
     * 解密
     *
     * @param content 内容
     * @return 明文
     */
    String decrypt(String content);

}