import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AlertService {
  private error = new BehaviorSubject(<any>[]);
  public error$ = this.error.asObservable();

  private warning = new BehaviorSubject(<any>[]);
  public warning$ = this.warning.asObservable();

  constructor() {}

  setAlert(name, title, type, alert) {
    console.log('simple')
    this[type].next([{
      name: name,
      title: title,
      type: type,
      message: JSON.stringify(alert || 'Empty message')
    }])
  }

  setAlertMultiple(name, type, alerts) {
    console.log('multiple')
    const auxAlerts = alerts.map( a => {
      return {
        name: name,
        title: `${type} (${a.type}) ${a.code}`,
        type: type,
        message: JSON.stringify(a.description || 'Empty message')
      }
    }

    );
    this[type].next(auxAlerts);
  }
}


// response.errors
// .map(x => x.description)
// .join('\n')
