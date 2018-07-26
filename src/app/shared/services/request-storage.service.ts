import { Injectable } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';

@Injectable()
export class RequestStorageService {
  tableResponses = 'storedResponses';
  tableRequests = 'interceptedRequest';

  constructor(private indexedDbService: IndexedDbService) {}

  /**
   * Loads data from indexed db
   * @param tableType string
   * @param key string
   */
  loadData(tableType, key): Promise<string> {
    if (tableType === 'rq') {
      return this.indexedDbService.retrieveData(this.tableRequests, key);
    } else if (tableType === 'rs') {
      return this.indexedDbService.retrieveData(this.tableResponses, key);
    }
  }

  /**
   *
   * @param req
   * @param res
   */
  storeRequestResponse(req, res) {
    const type = sessionStorage.getItem('currentRequestType');
    if (type && req) {
      const clone = JSON.parse(JSON.stringify(req));
      this.indexedDbService.saveData(this.tableRequests, type, clone);
    }

    if (type && res) {
      const clone = JSON.parse(JSON.stringify(res));
      this.indexedDbService.saveData(this.tableResponses, type, clone);
    }
  }

  setCurrentType(value) {
    sessionStorage.setItem('currentRequestType', value);
  }

}
