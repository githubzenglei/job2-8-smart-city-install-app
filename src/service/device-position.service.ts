import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/Observable/of';
import { catchError } from 'rxjs/operators';
import { ENV } from '@environment';


@Injectable()
export class GatewayService {
    isLoggedIn = false;
    error: boolean;
    model: any;
    // url = 'http://172.18.1.133:10003/security';
    // url = '/security';
    url = ENV.api;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    public token: string;

    constructor(private http: HttpClient) {

    }

//    // 获取位置信息 id
    getPositionById(id): Observable<any> {

        return this.http.get(`${this.url}/position/${id}`)
            .pipe(
                map((res) => {
                    return res;
                },
                    catchError((err) => {
                        console.log(err);
                        return of(err);
                    }
                    )
                ));

    }
    // 获取位置信息 number
    getPositionByNumber(number): Observable<any> {
        return this.http.get(`${this.url}/position/getByNumber/${number}`)
            .pipe(
                map((res) => {
                    return res;
                },
                    catchError((err) => {
                        console.log(err);
                        return of(err);
                    }
                    )
                ));
    }

    // 获取位置信息 deviceName
    getPositionByDeviceName(number, modelId): Observable<any> {
        return this.http.get(`${this.url}/position/getByDeviceName?deviceName=${number}&modelId=${modelId}`)
            .pipe(
                map((res) => {
                    return res;
                },
                    catchError((err) => {
                        console.log(err);
                        return of(err);
                    }
                    )
                ));
    }
    // 绑定网关位置
    bindPosition(body): Observable<any> {
        return this.http.post(`${this.url}/device/bindPosition`, body)
            .pipe(
                map((res) => {
                    return res;
                },
                    catchError((err) => {
                        console.log(err);
                        return of(err);
                    }
                    )
                ));
    }

    // 获取设备信息
    getDeviceByName(name): Observable<any> {
        return this.http.get(`${this.url}/device/getByNumber/${name}`)
            .pipe(
                map((res) => {
                    return res;
                },
                    catchError((err) => {
                        console.log(err);
                        return of(err);
                    }
                    )
                ));
    }




}


/*

Copyright(c): 2018 深圳创新设计研究院
Author: luo.shuqi@live.com
@file: GatewayService
@time: 2019 / 1 / 7 14: 18

*/

