export const fragmentTypes = {
  __schema: {
    types: [
      {
        kind: 'INTERFACE',
        name: 'AdviseMessage',
        possibleTypes: [{ name: 'Error' }, { name: 'Warning' }]
      },
      {
        kind: 'INTERFACE',
        name: 'Node',
        possibleTypes: [{ name: 'Destination' }, { name: 'Hotel' }]
      },
      { kind: 'INTERFACE', name: 'Text', possibleTypes: [] },
      {
        kind: 'UNION',
        name: 'WebSearchResult',
        possibleTypes: [{ name: 'HotelData' }, { name: 'DestinationData' }]
      }
    ]
  }
};
