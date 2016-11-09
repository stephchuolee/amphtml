/**
 * Copyright 2016 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  domFingerprintPlain,
  domFingerprint,
  stringHash32,
} from '../../../src/utils/dom-fingerprint';


describe('stringHash32', () => {
  it('should map a sample string appropriately', () => {
    expect(stringHash32('')).to.equal(5381);
  });
});

describe('domFingerprint', () => {
  let div1;
  let ampAd;
  const body = document.body;
  beforeEach(() => {
    // Start with empty body.
    while (body.firstChild) {
      body.removeChild(body.firstChild);
    }
    /*
      <div id='id1' ...>
        <div id='id2' ...>
          <table ...>       // table:0
            <tr>            // tr:0
              <td>...</td>  // td:0
              <td>          // td:1
                <amp-ad ...></amp-ad>
              </td>
            </tr>
            <tr>...</tr>    // tr:1
          </table>
        </div>
      </div>
     */
    div1 = document.createElement('div');
    div1.id = 'id1';
    div1.innerHTML =
      `<div id='id2'>
         <table>
           <tr>
             <td></td>
             <td>
               <amp-ad name="this one" type="adsense"></amp-ad>
             </td>
           </tr>
           <tr></tr>
         </table>
      </div>`;

    body.appendChild(div1);
    ampAd = document.getElementsByTagName('amp-ad')[0];
  });

  it('should map a sample DOM structure to the right string', () => {
    expect(domFingerprintPlain(ampAd)).to.equal(
      'amp-ad.0,td.1,tr.0,tbody.0,table.0,div/id2.0,div/id1.0,body.0,html.0');
  });
  it('should map a sample DOM structure to the right hashed value', () => {
    expect(domFingerprint(ampAd)).to.equal('2437661740');
  });

  afterEach(() => {
    body.removeChild(div1);
  });
});
