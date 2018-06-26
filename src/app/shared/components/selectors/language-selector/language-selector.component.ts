import { Component, Input, OnInit } from '@angular/core';
import { LANGUAGES } from 'app/core/interfaces/languages';
import { Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Language } from 'app/core/interfaces/language';
import { LanguageSelectorService } from './language-selector.service';
import { WebConfigService } from '../../../../core/services/web-config.service';

@Component({
  selector: 'b2b-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit {
  @Input() disabled: Boolean;
  language: Language = {
    iso_code: 'en',
    language_name: 'English'
  };
  languages = LANGUAGES;
  languageResultFormatter = (result: any) =>
    `${result.iso_code.toUpperCase()} - ${result.language_name}`;
  languageInputFormatter = (result: any) => {
    this.valuate(result.language_name);
    return result.language_name;
  };

  constructor(
    private languageSelectorService: LanguageSelectorService,
    private webConfigService: WebConfigService
  ) {}

  ngOnInit() {
    let defaultLanguage = this.webConfigService.getLanguage();
    if (defaultLanguage && defaultLanguage.language_name) {
      this.language = defaultLanguage;
    }
  }

  languageFilter = (text$: Observable<string>) =>
    text$
      .pipe(debounceTime(250))
      .pipe(distinctUntilChanged())
      .pipe(
        map(
          term =>
            term === ''
              ? []
              : this.languages.filter(item => {
                  const name =
                    item.language_name
                      .toLowerCase()
                      .indexOf(term.toLowerCase()) !== -1;

                  return (
                    item.iso_code.toLowerCase().indexOf(term.toLowerCase()) !==
                      -1 || name
                  );
                })
        )
      );

  /**
   * We pass the name target due to a we cannot have objects on NgModel yet and we
   * must valuate when the result was introduced by keyboard or by click selection on the typehead.
   * @param languageTarget
   */
  valuate(languageNameTarget) {
    let language = this.languages.filter(
      x => x.language_name.toLowerCase() === languageNameTarget.toLowerCase()
    );
    if (language.length === 1) {
      this.webConfigService.setLanguage(language[0]);
      this.languageSelectorService.language$.next(language[0]);
    } else {
      this.languageSelectorService.language$.next(null);
    }
  }
}
