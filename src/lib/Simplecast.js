const fetch = require('node-fetch');
const { unSlashIt, camelCaseKeys } = require('./utils');

class Simplecast {
  constructor({ token, podcastId }) {
    this.token = token;
    this.podcastId = podcastId;
    this.headers = {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    this.baseUrl = `https://api.simplecast.com`;
  }

  setHeaders = (headers = {}) => {
    // extract auth values to avoid potential bugs
    const { Authorization, authorization, ...newHeaders } = headers;
    const { headers: currentHeaders } = this;
    this.headers = {
      ...currentHeaders,
      ...newHeaders,
    };
  };

  request = (path = '', params = {}, method = 'GET') => {
    // TODO: let query = qs.stringify(params) || '';
    const url = this.baseUrl + '/' + unSlashIt(path);
    return fetch(url, {
      method,
      headers: this.headers,
      cache: 'default',
    });
  };

  getEpisode = async episodeId => {
    if (!episodeId) {
      throw Error('No episode ID provided.');
    }
    return this.request(`episodes/${episodeId}`)
      .then(res => res.json())
      .then(data => camelCaseKeys(data, { deep: true }))
      .catch(console.error);
  };

  getShowInfo = () => {
    return this.request(`podcasts/${this.podcastId}`)
      .then(res => res.json())
      .then(data => camelCaseKeys(data, { deep: true }))
      .catch(console.error);
  };

  getEpisodes = (limit = 10) => {
    try {
    const request = await this.request(
      `podcasts/${this.podcastId}/episodes?limit=${
        typeof limit === 'number' ? limit : 10
      }`
    )
    const json = await request.json();
    const info = await json.collection();
    return camelCaseKeys(info, {deep: true}))
    } catch(e) {
      console.error(e)
    }
  };
}

module.exports = Simplecast;
