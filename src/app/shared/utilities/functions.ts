/**
 * Returns an array
 * @param num
 * @param zero
 */
export function getArrayUses(num: number, zero: boolean = true): Array<number> {
  return zero
    ? Array(num)
        .fill(NaN)
        .map((x, i) => i)
    : Array(num)
        .fill(NaN)
        .map((x, i) => i)
        .slice(1);
}

/**
 * Get type of a variable
 */
export function getType(obj: any) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

export function formatHoursToDaysHours(hoursBefore: number): string {
  if (hoursBefore < 24 && hoursBefore !== 0) {
    return hoursBefore + ' h';
  } else if ((hoursBefore / 24) % 1 !== 0) {
    return (
      Math.floor(hoursBefore / 24) +
      ' d ' +
      ((hoursBefore / 24) % 1) * 24 +
      ' h'
    );
  } else {
    return String(hoursBefore / 24);
  }
}

/**
 * Test if the variable contains something. If not returns the class "disabled" to css styles.
 * @param variableToTest Test if the variable contains something
 * @param actualClass Actual classes from the element tag "Class"
 */
export function getDisabled(
  variableToTest: any[],
  actualClass: string
): string {
  return !variableToTest || variableToTest.length === 0
    ? 'disabled ' + actualClass
    : actualClass;
}

/**
 * Transforms an enumerate into an a printable array
 * @param enumerate
 */
export function enumToArray(enumerate: any) {
  const enumMaped = [];
  Object.keys(enumerate).map((e, i) => {
    enumMaped[i] = { name: enumerate[e], value: e };
  });
  return enumMaped;
}

/**
 * Stores requests
 * @param req
 */
export function storeRequest(req) {
  // Filtrado GUARRO según las propiedades dentro de 'variables'

  const requestsToSave =
    JSON.parse(sessionStorage.getItem('interceptedRequest')) || {};
  const isHotelCriteria = req.body.query.includes('HotelCriteriaSearchInput');
  const isQuoting = req.body.query.includes('optionRefId');
  const isBooking = req.body.query.includes('Mutation($input: HotelBookInput!');
  const isMyBookings = req.body.query.includes('booking($criteriaBooking');
  const isCancelBooking = req.body.query.includes('cancelBooking');

  if (isHotelCriteria) {
    requestsToSave['hotelRQ'] = req;
  } else if (isQuoting) {
    requestsToSave['quoteRQ'] = req;
  } else if (isBooking) {
    requestsToSave['bookRQ'] = req;
  } else if (isMyBookings) {
    requestsToSave['myBookingsRQ'] = req;
  } else if (isCancelBooking) {
    requestsToSave['cancelBookingRQ'] = req;
  } else {
    return;
  }

  sessionStorage.setItem('interceptedRequest', JSON.stringify(requestsToSave));
}

/**
 * Loads requests
 * @param dataType
 */
export function loadRequest(dataType) {
  const request = JSON.parse(sessionStorage.getItem('interceptedRequest'))[
    dataType
  ];
  request.body.query = request.body.query.replace(/\n/gi, '');

  // const formatRequest = function(obj) {
  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       stringifyArray(obj, key);
  //     }
  //   }
  // };

  // const stringifyArray = function(item, key) {
  //   if (item[key] !== null && item[key].constructor === Array) {
  //     item[key] = JSON.stringify(item[key]).replace(/\"/gi, "'");
  //   } else if (item[key] !== null && typeof item[key] === 'object') {
  //     formatRequest(item[key]);
  //   }
  // };

  // formatRequest(request.body.variables);

  return request;
}

/**
 * Stores responses
 * @param name
 * @param response
 */
export function storeResponse(name, response) {
  const responsesToSave =
    JSON.parse(sessionStorage.getItem('storedResponses')) || {};

  responsesToSave[name] = response;

  sessionStorage.setItem('storedResponses', JSON.stringify(responsesToSave));
}

/**
 * Loads responses
 * @param dataType
 */
export function loadResponse(dataType) {
  const response = JSON.parse(sessionStorage.getItem('storedResponses'))[
    dataType
  ];
  return response;
}

export function decideClosure(event, datepicker) {
  const path = event.path.map(p => p.localName);
  if (!path.includes('ngb-datepicker')) {
    datepicker.close();
  }
}
