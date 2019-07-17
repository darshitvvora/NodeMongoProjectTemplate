/* eslint-env node */
import 'babel-polyfill';

import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/mocha-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';


import { TestBed, getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

const testsContext = require.context('./client', true, /\.(spec|test)\.js$/);
// testsContext.keys().forEach(testsContext);
testsContext('./app/main/main.component.spec.js');
testsContext('./components/util.spec.js');

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

