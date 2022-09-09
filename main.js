"use strict";
/// <reference path="jquery-3.6.0.js" />

$(() => {

  $('section').hide();

  /* ----- AJAX ----- */
  const getJSON = (url) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        success: data => {
          resolve(data);
        },
        error: err => {
          reject(err);
        }
      });
    });
  };

  // Display Results
  const displayResults = (countries) => {
    $('section').show();
    let sum = 0;
    let counter = 0;
    for (const country of countries) {
      if (country.name) counter++;
      sum += country.population;
    }
    $('#numOfCountries').html(`Total Countries: ${counter}`);
    $('#sumPopulation').html(`Total Countries Population: ${sum}`);
    $('#avgPopulation').html(`Average Population: ${(sum / counter).toFixed()}`);
    displayCountryTable(countries);
    displayRegionTable(countries);
    displayCurrencies(countries);
  };

  // All button click handler
  $('#allBtn').on('click', async function () {
    const allCountries = await getAllCountries();
    displayResults(allCountries);
  });

  // Get all countries
  const getAllCountries = async () => {
    try {
      return await getJSON('https://restcountries.com/v3.1/all');
    }
    catch (err) {
      alert(err.message);
    }
  };

  // Search button click handler
  $('#btnSearch').on('click', async function () {
    const searchedCountries = await getSearchedCountries();
    displayResults(searchedCountries);
  });

  // Get searched countries
  const getSearchedCountries = async () => {
    try {
      const textToSearch = $('input[type=search]').val().toLowerCase();
      if (textToSearch === '') {
        alert('Please Enter Country Name');
        return;
      }
      return await getJSON(`https://restcountries.com/v3.1/name/${textToSearch}`);
    }
    catch (err) {
      $('input[type=search]').val('');
      err = new Error("No Country Found");
      alert(err.message);
    }
  };

  // Display Country table data
  const displayCountryTable = (countries) => {
    let content = '';
    for (const country of countries) {
      const tr = `
        <tr>
          <td>${country.name.official}</td>
          <td>${country.population}</td>
        </tr>
      `;
      content += tr;
    }
    $('#countryTable').html(content);
  };

  // Display Region table data
  const displayRegionTable = (countries) => {
    let content = '';
    const regions = new Map();
    let counter;
    for (const country of countries) {
      counter = regions.get(country.region);
      if (counter) {
        counter++;
      } else {
        counter = 1;
      }
      regions.set(country.region, counter);
    }
    for (const region of regions) {
      const key = region[0];
      const value = region[1];
      const tr = `<tr>
          <td>${key}</td>
          <td>${value}</td>
        </tr>
      `;
      content += tr;
    }
    $('#regionTable').html(content);
  };

  // Display Currencies table data
  const displayCurrencies = (countries) => {
    let content = '';
    const currencies = new Map();
    let counter;
    for (const country of countries) {
      if (country.currencies) {
        for (const currency of Object.values(country.currencies)) {
          counter = currencies.get(currency.name);
          if (counter) {
            counter++;
          } else {
            counter = 1;
          }
          currencies.set(currency.name, counter);
        }
      }
    }
    for (const currency of currencies) {
      const key = currency[0];
      const value = currency[1];
      const tr = `<tr>
        <td>${key}</td>
        <td>${value}</td>
        </tr>
      `;
      content += tr;
    }
    $('#currenciesTable').html(content);
  };
});
