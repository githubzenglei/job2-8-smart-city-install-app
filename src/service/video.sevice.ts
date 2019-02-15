
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

//设备属性
const options = {
    productKey: "a1LyKnUhBze",
    deviceName: "x5u8yU9KlCmQr5A3EOfU",
    deviceSecret: "AYi94MT6Fi47Iylf7Ox5UanQjmB5pII0",
    regionId: "cn-shanghai"
};
const commonStr = `&Format=JSON
&Version=2018-01-20
&Signature=Pc5WB8gokVn0xfeu%2FZV%2BiNM1dgI%3D
&SignatureMethod=HMAC-SHA1
&SignatureNonce=15215528852396
&SignatureVersion=1.0
&AccessKeyId=...
&Timestamp=2018-05-20T12:00:00Z
&RegionId=cn-shanghai`;
const url = 'https://iot.cn-shanghai.aliyuncs.com/?Action=QueryProduct';
@Injectable()
export class VideoService {

    constructor(private http: HttpClient) {


    }
    // 获取指定坐标范围内的摄像头信息
    getCameras(ne: any, sw: any): Observable<any> {
        return this.http.post('/api/camera/inbounds', {
            'ne': ne,
            'sw': sw
        })
            .pipe(map((res) => {
                return res;
            }));
    }

    // 签名
    // 1.
    // 按参数名的字典顺序，对请求参数进行排序，包括 公共请求参数（不包括 Signature 参数）和接口的自定义参数

    // 2
    // 对参数名称和参数值进行 URL 编码。
    // 使用UTF-8字符集按照 RFC3986 规则编码请求参数名和参数值
    // Javascript的escape()，encodeURIComponent(),encodeURI ()这三个函数进行URL编码,防止特殊字符接收不到。
    urlEncode(url:string) {
        // url = URLEncoder.encode(url, "UTF-8");
        return url;
    }

    generateQueryString() {

    }

    percentEncode(value: string) {
       //  使用的是Java标准库中的java.net.URLEncoder，可以先用标准库中percentEncode编码，随后将编码后的字符中加号 + 替换为 % 20、星号 * 替换为 % 2A、% 7E替换为波浪号~
        // 使用URLEncoder.encode编码后，将"+","*","%7E"做替换即满足 API规定的编码规范
        return value == null ? null
            : value
            // : URLEncoder.encode(value, CHARSET_UTF8).replace("+", "%20").replace("*", "%2A").replace("%7E","~");
    }
    // 查找产品
    QueryProduct(): Observable<any> {
        return this.http.get(`${url}&ProductKey=${options.productKey}${commonStr}`)
            .pipe(map((res) => {
                return res;
            }));
    }



}
