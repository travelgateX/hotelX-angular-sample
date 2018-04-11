import { Injectable } from '@angular/core';

@Injectable()
export class RequestStorageService {

  constructor() { }

  /**
 * Stores requests
 * @param req
 */
storeRequest(req) {
  // Filtrado GUARRO según las propiedades dentro de 'variables'
  const request = JSON.parse(JSON.stringify(req));
  request.bearer = 'Bearer ' + localStorage.getItem('token');

  const requestsToSave =
    JSON.parse(sessionStorage.getItem('interceptedRequest')) || {};
  const isHotelCriteria = req.body.query.includes('HotelCriteriaSearchInput');
  const isQuoting = req.body.query.includes('optionRefId');
  const isBooking = req.body.query.includes('Mutation($input: HotelBookInput!');
  const isMyBookings = req.body.query.includes('booking($criteriaBooking');
  const isCancelBooking = req.body.query.includes('cancelBooking');

  if (isHotelCriteria) {
    requestsToSave['hotelRQ'] = request;
  } else if (isQuoting) {
    requestsToSave['quoteRQ'] = request;
  } else if (isBooking) {
    requestsToSave['bookRQ'] = request;
  } else if (isMyBookings) {
    requestsToSave['myBookingsRQ'] = request;
  } else if (isCancelBooking) {
    const input = request.body.variables.input;
    requestsToSave['cancelBookingRQ_' + input.reference.supplier] = request;
  } else {
    return;
  }
  sessionStorage.setItem('interceptedRequest', JSON.stringify(requestsToSave));
}

/**
 * Loads requests
 * @param dataType
 */
loadRequest(dataType) {
  const request = JSON.parse(sessionStorage.getItem('interceptedRequest'))[
    dataType
  ];
  request.body.query = request.body.query.replace(/\n/gi, '');

  return request;
}

/**
 * Stores responses
 * @param name
 * @param response
 */
storeResponse(name, response) {
  const responsesToSave =
    JSON.parse(sessionStorage.getItem('storedResponses')) || {};

  responsesToSave[name] = response;

  sessionStorage.setItem('storedResponses', JSON.stringify(responsesToSave));
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
