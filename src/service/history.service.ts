import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/Observable/of';
import { catchError } from 'rxjs/operators';
// import { Storage } from '@ionic/storage';
import { ENV } from '@environment';


@Injectable()
export class HistoryService {
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
    getAllHistory(userId): Observable<any> {

        return this.http.get(`${this.url}/install/all?userId=${userId}`)
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

    // /api/install?userId=9602fc32-4268-4a25-b0c9-e3d45990c3da&page=1&pageSize=20&from=2018-01-01&to=2019-02-11


    getHistory(userId, page, pageSize, queryStr): Observable<any> {

        return this.http.get(`${this.url}/install?userId=${userId}&page=${page}&pageSize=${pageSize}&queryStr=${queryStr}`)
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

