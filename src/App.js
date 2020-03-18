import React, { Component } from 'react';
import './App.css';
import { getAddressId, getParcelId, getRates, getLabel } from './Api/EasyPost';
import { humanify } from './stringMap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFields: {
        fromAddress: {
          name: '',
          company: '',
          street1: '',
          street2: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        },
        toAddress: {
          name: '',
          company: '',
          street1: '',
          street2: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        },
        parcelInformation: {
          length: '',
          width: '',
          height: '',
          weight: '',
        },
      },
      rateFields: [],
      rateSelection: -1,
      shipmentId: '',
      labelField: '',
      trackingField: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateRates = this.generateRates.bind(this);
    this.handleRates = this.handleRates.bind(this);
    this.rateSubmit = this.rateSubmit.bind(this);
  }

  handleInputChange(e, section, field) {
    this.setState({
      inputFields: {
        ...this.state.inputFields,
        [section]: {
          ...this.state.inputFields[section],
          [field]: e.target.value,
        }
      }
    });
  }

  handleSubmit(e) {
    let from = this.state.inputFields.fromAddress;
    let to = this.state.inputFields.toAddress;
    let parcel = this.state.inputFields.parcelInformation;
    let flag = false;
    //check if all valid
    if((!from.street1 || !from.city || !from.state || !from.zip || !from.country ||
      !to.street1 || !to.city || !to.state || !to.zip || !to.country) && !flag) {
      alert('please fill in address information correctly!');
      return;
    }

    Object.values(parcel).map(e => {
      if((!e || isNaN(e)) && !flag){
        alert('please fill in parcel information correctly!');
        flag = true;
      }
      return 0;
    })

    if(flag) return;

    // send everything generate rates
    let fromPromise = getAddressId(from);
    let toPromise = getAddressId(to);
    let parcelPromise = getParcelId(parcel);
    fromPromise.then(proxyResponse => {
      proxyResponse.json().then(fromResponse => {
        toPromise.then(proxyResponse2 => {
          proxyResponse2.json().then(toResponse => {
            parcelPromise.then(proxyResponse3 => {
              proxyResponse3.json().then(parcelResponse => {
                this.generateRates(fromResponse, toResponse, parcelResponse);
              });
            });
          });
        });
      });
    });
    e.preventDefault();
  }

  generateRates(from, to, parcel) {
    let data = {
      shipment: {
        is_return: true,
        to_address: to,
        from_address: from,
        parcel: parcel
      }
    }
    let ratePromise = getRates(data);

    ratePromise.then(proxyResponse => {
      proxyResponse.json().then(rateResponse => {
        this.setState({ rateFields: rateResponse.rates });
        this.setState({ shipmentId: rateResponse.id });
      });
    });
  }

  handleRates(i) {
    this.setState({ rateSelection: i });
  }

  rateSubmit(e) {
    let labelPromise = getLabel({rate: this.state.rateFields[this.state.rateSelection]}, this.state.shipmentId);
    labelPromise.then(proxyResponse => {
      proxyResponse.json().then(labelResponse => {
        this.setState({ labelField: labelResponse.postage_label.label_url });
        this.setState({ trackingField: labelResponse.tracking_code });
      });
    });
  }
  
  render() {
    const { inputFields, rateFields, rateSelection, labelField, trackingField } = this.state;
    return (
      <div className='App'>
        <h1>Stesstacular Shipping Label Generator</h1>
        {!labelField &&
          <form onSubmit={this.handleSubmit}>
            <div className='input-container'>
              {Object.keys(inputFields).map(section =>
                <div key={section} className='section-container'>
                  <h3>{humanify(section)}</h3>
                    {Object.keys(inputFields[section]).map(field => 
                      <div key={field} className='field-container'>
                        <p>{humanify(field)}</p>
                        <input id={section + ':' + field} type="text" value={inputFields[section][field]} onChange={e => this.handleInputChange(e, section, field)} />
                      </div>
                    )}
                </div>
              )}
            </div>
            <input className='button' type='submit' value='Submit' />
          </form>
        }
        {!labelField && rateFields.length > 0 &&
        <div className='rate-selection-container'>
          {rateFields.map((rate, i) => 
            <div className={'rate-container' + (rateSelection >= 0 && rateFields[rateSelection].id === rate.id ? ' active' : '')} key={rate.id}>
              <button className='rate-button' id={rate.id} onClick={() => this.handleRates(i)}>
                Select
              </button>
              <div>
                <b>Carrier:</b> {rate.carrier}, <b>Service:</b> {rate.service}<br/>
                <b>Rate:</b> {rate.rate} {rate.currency}, <b>Delivery Time:</b> {rate.delivery_days ? rate.delivery_days : 'N/A'}<br/>
                <b>Delivary Date:</b> {rate.delivery_date ? rate.delivery_date : 'N/A'}<br/>
              </div>
            </div>
          )}
          {rateSelection >= 0 &&
            <button onClick={this.rateSubmit}>Confirm Selection</button>
          }
        </div>
        }
        {labelField &&
        <div>
          <h2>Thank You for Using Stesstacular Shipping Label Generator!</h2>
          <h4>Your tracking code is: {trackingField}</h4>
          <a href={labelField} target='_blank' rel="noopener noreferrer">CLICK HERE FOR YOUR SHIPMENT LABEL</a>
        </div>
        }
      </div>
    );
  }
}

export default App;
