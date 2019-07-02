import { LangService } from 'app/core/services/lang.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'b2b-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  environment: any;
  language: string;
  constructor(private langService: LangService) {}

  /**
   * Remove parallax
   * It's done here because footer and header components are the uniques which are imported always
   */
  ngOnInit() {
    $('.parallax-mirror').remove();
    this.environment = environment;
    this.language = this.langService.getLang();
  }

  downloadTerms() {
    this.download()
      .toPromise()
      .then(res => {})
      .catch(err => {});
  }

  download(): Observable<Object[]> {
    return Observable.create(observer => {
      const xhr = new XMLHttpRequest();
      let archive: string;

      if (this.language === 'es') {
        archive = 'TraveltinoTermsES.pdf';
      } else {
        archive = 'TraveltinoTermsEN.pdf';
      }
      xhr.open('GET', './assets/img/traveltino/' + archive, true);
      xhr.setRequestHeader('Content-Type', 'application/pdf; charset=utf-8');

      xhr.responseType = 'blob';

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const contentType = 'application/pdf';
            const blob = new Blob([xhr.response], { type: contentType });
            observer.next(blob);
            observer.complete();
            FileSaver.saveAs(blob, archive);
          } else {
            observer.error(xhr.response);
          }
        }
      };
      xhr.send();
    });
  }
}
