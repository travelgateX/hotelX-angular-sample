import { Injectable } from '@angular/core';

@Injectable()
export class IndexedDbService {
  database: string = 'B2BDatabase';
  db: IDBDatabase;

  constructor() {}

  openDB(tables?: string[]): Promise<any> {
    if (!window.indexedDB) {
      console.log('SlidingPuzzle: browser does not support indexedDB');
    } else {
      let selfPromise = this;
      return new Promise(function(resolve, reject) {
        let selfDB = selfPromise;
        let request = window.indexedDB.open(selfPromise.database);
        request.onerror = function(event) {
          reject();
          console.log('error');
          console.log(event);
        };
        request.onupgradeneeded = function(event) {
          tables.map(table => {
            event.target['result'].createObjectStore(table);
          });
        };
        request.onsuccess = function(event) {
          // event.target['result'].createObjectStore('testingObject');
          selfDB.db = event.target['result'];
          resolve();
          console.log('succes');
          console.log(event);
        };
      });
    }
  }

  saveData(table: string, key: any, value: any) {
    if (!this.db) {
      this.openDB().then(
        res => {
          this.executeSaveTransaction(table, key, value);
        },
        err => {
          console.log('Fail opening the IndexedDB');
        }
      );
    } else {
      this.executeSaveTransaction(table, key, value);
    }
  }

  executeSaveTransaction(table: string, key: any, value: any) {
    let transaction = this.db.transaction(table, 'readwrite');
    let objectStore = transaction.objectStore(table);
    let request = objectStore.put(value, key);
    request.onerror = function(event) {
      console.log(
        'SlidingPuzzle: error writing to database, ' + request.error.name
      );
    };
    request.onsuccess = function(event) {
      console.log('successfullsave');
    };
  }

  retrieveData(table: string, key: any): Promise<any> {
    let self = this;
    return new Promise(function(resolve, reject) {
      let transaction = self.db.transaction(table);
      let objectStore = transaction.objectStore(table);
      let request = objectStore.get(key);
      request.onerror = function(event) {
        console.log(event);
      };
      request.onsuccess = function(event) {
        console.log(event);
        resolve(event.target['result']);
      };
    });
  }

  closeDB() {
    if (this.db) {
      this.db.close();
    }
    let request = window.indexedDB.deleteDatabase(this.database);
    request.onblocked = function(event) {
      console.log(event);
      console.log('Error message: Database in blocked state. ');
    };
    request.onerror = function(event) {
      console.log('Error deleting database.');
    };

    request.onsuccess = function(event) {
      console.log('Database deleted successfully');

      console.log(event); // should be undefined
    };
  }
}
