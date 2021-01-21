import { Inject,Injectable, InjectionToken } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

export const MY_AWESOME_SERVICE_STORAGE = new InjectionToken<StorageService>('MY_AWESOME_SERVICE_STORAGE');

@Injectable()
export class SetSession {
    public data:any=[];
    constructor(
        @Inject(MY_AWESOME_SERVICE_STORAGE) private storage: StorageService
        ){}
    setSession(key:string, value:string){
        this.storage.set(key,value);
        this.data[key] = this.storage.get(key);
        console.log('session of : '+this.data[key]);
    }
    getSessionUser(key:string):string{
        return this.storage.get(key);
    }
}
