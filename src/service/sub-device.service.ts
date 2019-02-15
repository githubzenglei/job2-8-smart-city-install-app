import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/Observable/of';
import { catchError } from 'rxjs/operators';
import { ENV } from '@environment';


@Injectable()
export class SubDeviceService {
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



    // 获取设备型号
    getModels(): Observable<any> {
        return this.http.get(`${this.url}/device/model/all`)
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

    // 获取设备型号指定类型
    getModelsByType(type): Observable<any> {
        return this.http.get(`${this.url}/device/model/all?type=${type}`)
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
    // 新增子设备
    addDevice(body): Observable<any> {
        return this.http.post(`${this.url}/device/subDevice`, body)
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
        return this.http.get(`${this.url}/device/getByName?name=${name}`)
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
@file: SubDeviceService
@time: 2019 / 1 / 22 14: 18

*/

