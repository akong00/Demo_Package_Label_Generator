const stringMap = {
  name: 'Name',
  company: 'Company',
  street1: 'Street Line 1',
  street2: 'Street Line 2',
  city: 'City',
  state: 'State',
  zip: 'Zip',
  country: 'Country',
  fromAddress: 'Address (From)',
  toAddress: 'Address (To)',
  parcelInformation: 'Parcel Information',
  length: 'Length(inches)',
  width: 'Width(inches)',
  height: 'Height(inches)',
  weight: 'Weight(oz)',
}

export function humanify(str) {
  return stringMap[str];
}