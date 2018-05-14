import { Injectable } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';

@Injectable()
export class RequestStorageService {
  constructor(private indexedDbService: IndexedDbService) {}

  /**
   * Stores requests
   * @param req
   */
  storeRequest(req) {
    const table = 'interceptedRequest';
    // Filtrado GUARRO según las propiedades dentro de 'variables'
    const request = JSON.parse(JSON.stringify(req));
    request.bearer = 'Bearer ' + localStorage.getItem('token');

    const requestsToSave =
      JSON.parse(sessionStorage.getItem('interceptedRequest')) || {};
    const isHotelCriteria = req.body.query.includes('HotelCriteriaSearchInput');
    const isQuoting = req.body.query.includes('optionRefId');
    const isBooking = req.body.query.includes(
      'Mutation($input: HotelBookInput!'
    );
    const isMyBookings = req.body.query.includes('booking($criteriaBooking');
    const isCancelBooking = req.body.query.includes('cancelBooking');

    if (isHotelCriteria) {
      console.count();
      this.indexedDbService.saveData(table, 'hotelRQ', request);
    } else if (isQuoting) {
      this.indexedDbService.saveData(table, 'quoteRQ', request);
    } else if (isBooking) {
      this.indexedDbService.saveData(table, 'bookRQ', request);
    } else if (isMyBookings) {
      this.indexedDbService.saveData(table, 'myBookingsRQ', request);
    } else if (isCancelBooking) {
      const input = request.body.variables.input;
      this.indexedDbService.saveData(
        table,
        'cancelBookingRQ_' + input.reference.supplier,
        request
      );
    } else {
      return;
    }
    // sessionStorage.setItem('interceptedRequest', JSON.stringify(requestsToSave));
  }

  /**
   * Loads requests
   * @param dataType
   */
  loadRequest(dataType) {
    return this.indexedDbService
      .retrieveData('interceptedRequest', dataType)
      .then(res => {
        return Promise.resolve(JSON.stringify(res))
      });
  }

  /**
   * Stores responses
   * @param name
   * @param response
   */
  storeResponse(name, response) {
    const responsesToSave =
      JSON.parse(sessionStorage.getItem('storedResponses')) || {};

    this.indexedDbService.saveData('storedResponses', name, response);

    // sessionStorage.setItem('storedResponses', JSON.stringify(responsesToSave));
  }

  /**
   * Loads responses
   * @param dataType
   */
  loadResponse(dataType) {
    const response = JSON.parse(sessionStorage.getItem('storedResponses'))[
      dataType
    ];
    return response;
  }
}
