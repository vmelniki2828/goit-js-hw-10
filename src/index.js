import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchButton = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


searchButton.addEventListener('input', debounce(onInputName, DEBOUNCE_DELAY));

function onInputName(evt) {
  const searchedCountry = evt.target.value.trim();
  if (searchedCountry === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(searchedCountry)
    .then(countries => renderCountries(countries))
    .catch(error => {
      console.dir(error);
      if (error.message === '404') {
        Notify.failure('Oops, there is no country with that name');
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
      }
    });
}

function renderCountries(countries) {
  console.dir(countries);
  if (countries.length === 1) {
    const markup = countries
      .map(country => {
        return `<img 
        src="${country.flags.svg}"
        alt="${country.name.official} flag" width=320 heigth=240>
        <p><b>Country</b>: ${country.name.official}</p>
        <p><b>Capital</b>: ${country.capital}</p>
        <p><b>Population</b>: ${country.population}</p>
        <p><b>Languages</b>: ${Object.values(country.languages).join(', ')}</p>`;
      })
      .join('');
      countryList.innerHTML = '';
      countryInfo.innerHTML = markup;
    return;
  }
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  } else {
    const markup = countries
      .map(country => {
        return `
      <li>
      <img 
      src="${country.flags.svg}"
      alt="${country.name.official} flag" width=53 heigth=40>
      <span><b> ${country.name.official}</b></span>
      </li>`;
      })
      .join('');
    countryInfo.innerHTML = '';
    countryList.innerHTML = markup;
  }
}