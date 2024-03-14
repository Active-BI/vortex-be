import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as moment from 'moment';
import axios from 'axios';

@Injectable()
export class TreinamentosService {

  async findAll(playlist) {
    
    const apiKey = 'AIzaSyDQ7M9VBoOw6R3XZiYQqiDNg_phHVuvQiw';
    const playlistId = playlist;
    const allVideos = []
    const pageTokens = []
    let pageToken = '';
    // const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet&maxResults=10&pageToken=${pageToken}`;
    // const response = await axios.get(apiUrl);
    // return this.tratarDados(await response.data.items)

    while (true) {
      const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet&maxResults=50&pageToken=${pageToken}`;
        const response = await axios.get(apiUrl);
        const data = this.tratarDados(await response.data.items)
        allVideos.push(...data)

        console.log(response.data.nextPageToken)
        if (response.data.nextPageToken) {
          if (pageTokens.includes((response.data.nextPageToken))) {
            return allVideos
          }
          pageTokens.push(response.data.nextPageToken)
          pageToken = response.data.nextPageToken;
      } else {
          return allVideos
        }
      }
  }

  tratarDados(dados: any[]) {
    return dados.map((item) => {
      const date = moment(item.snippet.publishedAt);
      const now = moment();

      const yearsAgo = now.diff(date, 'years');
      const monthsAgo = now.diff(date, 'months');
      const daysAgo = now.diff(date, 'days');

      let summary: string;

      if (yearsAgo >= 1) {
        summary = `há ${yearsAgo} ano${yearsAgo > 1 ? 's' : ''} atrás`;
      } else if (monthsAgo >= 1) {
        summary = `há ${monthsAgo} mês${monthsAgo > 1 ? 'es' : ''} atrás`;
      } else {
        summary = `há ${daysAgo} dia${daysAgo > 1 ? 's' : ''} atrás`;
      }

      return {
        ...item,
        date: summary,
      };
    })
  }

  
}
