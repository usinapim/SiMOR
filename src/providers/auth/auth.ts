import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, RequestOptionsArgs} from '@angular/http';
import 'rxjs/add/operator/map';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/throw';
// import 'rxjs/add/operator/timeoutWith';
import {Storage} from "@ionic/storage";
import {Config} from "../../app/config/config";

/*
 Generated class for the AuthProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class AuthProvider {

    public access_token: any;
    apiUrl: any;
    requestUri: any;
    headers: Headers;
    options: RequestOptions;
    opt: RequestOptionsArgs;
    timeout = 10000;

    constructor(public http: Http, public storage: Storage, public _config: Config) {
        console.log('Hello AuthProvider Provider');

        this.apiUrl = _config.get('apiUrl');
        this.requestUri = _config.get('apiUrl') + _config.get('apiPath');

        this.headers = new Headers({'Content-Type': 'application/json'});

        this.opt = {
            headers: this.headers
        };

        this.options = new RequestOptions(this.opt);


    }

    checkAuthentication() {

        return new Promise(
            (resolve, reject) => {

                //Load token if exists
                this.storage.get('access_token').then((value) => {

                    this.access_token = value;

                    this.headers.append('Authorization', 'Bearer ' + this.access_token);
                    this.opt = {
                        headers: this.headers
                    };

                    this.options = new RequestOptions(this.opt);

                    this.http.get(this.requestUri + '/me', this.options)
                        .timeout(this.timeout)
                        .subscribe(res => {
                            resolve(res);
                            console.log('checkAuthentication res', res);
                        }, (err) => {
                            reject(err);
                            console.error('checkAuthentication err', err);
                        })
                        ;

                });

            });

    }

    login(credentials) {

        return new Promise(
            (resolve, reject) => {

                this.http.post(this.apiUrl + '/oauth/token', JSON.stringify(credentials), this.options)
                    .timeout(this.timeout)
                    .subscribe(res => {

                        let data = res.json();
                        console.log('login data', data)
                        this.access_token = data.access_token;
                        this.storage.set('access_token', data.access_token);
                        resolve(data);

                        resolve(res.json());
                    }, (err) => {
                        reject(err);
                        console.error('err', err)
                    });

            });

    }

    logout() {
        return new Promise(
            (resolve, reject) => {

                this.storage.get('access_token').then(
                    (value) => {
                        this.access_token = '';
                        this.storage.set('access_token', '');

                        // TODO cuando ande el delete comentar lo que esta arriba y descomentar lo de abajo
                        // this.http.delete(this.apiUrl + '/oauth/tokens/' + value, this.options)
                        //     .subscribe(
                        //         res => {
                        //
                        //             let data = res.json();
                        //
                        //             this.access_token = '';
                        //             this.storage.set('access_token', '');
                        //             resolve(data);
                        //
                        //             resolve(res.json());
                        //         },
                        //         (err) => {
                        //             reject(err);
                        //             console.error('err', err)
                        //         }
                        //     );
                    });


            });
    }

}
