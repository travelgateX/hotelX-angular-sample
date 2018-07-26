import { Injectable } from '@angular/core';

@Injectable()
export class IndexedDbService {
  database = 'B2BDatabase';
  db: IDBDatabase;

  constructor() {}

  openDB(tables?: string[]): Promise<any> {
    if (!window.indexedDB) {
      console.log('SlidingPuzzle: browser does not support indexedDB');
    } else {
      const selfPromise = this;
      return new Promise(function(resolve, reject) {
        const selfDB = selfPromise;
        const request = window.indexedDB.open(selfPromise.database);
        request.onerror = function(event) {
          reject();
          console.log('error');
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
          // console.log('succes');
          // console.log(event);
        };
      });
    }
  }

  executeSaveTransaction(table: string, key: any, value: any) {
      const transaction = this.db.transaction(table, 'readwrite');
      const objectStore = transaction.objectStore(table);

      const request = objectStore.put(value, key);
      request.onerror = function(event) {
        console.log(
          'SlidingPuzzle: error writing to database, ' + request.error.name
        );
      };
      request.onsuccess = function(event) {
        // console.log('successfullsave');
      };
  }

  saveData(table: string, key: any, value: any) {
      if (!this.db) {
        this.openDB().then(
          res => {
            // console.log(table, key, value);
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

  retrieveData(table: string, key: any): Promise<any> {
    console.log(key);
    const self = this;
    const auxFunc = async () => {
      const awaited = await new Promise(function(resolve, reject) {
        const transaction = self.db.transaction(table);
        const objectStore = transaction.objectStore(table);
        const request = objectStore.get(key);
        request.onerror = function(event) {
        };
        request.onsuccess = function(event) {
          resolve(event.target['result']);
        };
      });
      return awaited;
    };

    return auxFunc();
  }

  closeDB() {
    if (this.db) {
      this.db.close();
    }
    const request = window.indexedDB.deleteDatabase(this.database);
    request.onblocked = function(event) {
      console.log('Error message: Database in blocked state. ');
    };
    request.onerror = function(event) {
      console.log('Error deleting database.');
    };

    request.onsuccess = function(event) {
      console.log('Database deleted successfully');
    };
  }
}
