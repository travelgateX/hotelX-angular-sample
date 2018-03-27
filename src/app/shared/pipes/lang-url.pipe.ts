import { Pipe, PipeTransform } from '@angular/core';

/**
 * Creates differents paths based on a language
 */
@Pipe({
  name: 'langUrl',
})
export class LangUrlPipe implements PipeTransform {
  /**
   * Returns the current location considering the language argument
   * @param lang the language code
   */
  transform(lang: string): string {
    const path = location.pathname.split('/');
    return `/${lang}/${path.splice(2, path.length).join('/')}`;
  }
}
