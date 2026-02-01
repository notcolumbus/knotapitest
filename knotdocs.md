> ## Documentation Index
> Fetch the complete documentation index at: https://docs.knotapi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Quickstart

> Get started with the CardSwitcher integration by creating a session for the SDK.

## Introduction

Integrating Knot is quite simple. You'll need a basic client-side and server-side integration, including calling the API, invoking the SDK, and subscribing to webhooks.

## Entry points

#### Overview

How and where you place entry points to invoke the Knot flow in your app play a crucial role driving engagement and delivering value to end users. Nearly all apps that integrate Knot develop multiple entry points into the Knot flow (e.g. different tabs or screens).

As a result and **to provide better visibility into the conversion of the flow across different entry points**, the Knot SDK supports an `entryPoint` parameter when invoking the SDK which allows you to specify the entry point from which the user came. This value is then returned in the down-funnel [`AUTHENTICATED`](/link/webhook-events/authenticated) webhook event, thereby allowing you to measure the conversion of the flow by entry point in your analytics tool of choice.

#### Usage

It is strongly recommended to take advantage of this functionality, so as to future-proof your visibility into your implementation and allow for future optimizations. To take advantage of this functionality, simply pass a different value to `KnotConfiguration.entryPoint` for each of your entry points when [configuring the session to invoke the SDK](/sdk/ios#configure-the-session).

Common entry points include the following: `onboarding`, `home`, `push-notif-X`, `in-app-lifecycle-card-X`, etc.

## Start the Flow

<AccordionGroup>
  <Accordion title="Access your customer dashboad" icon="table-columns">
    Ensure you have access to your [Customer Dashboard](https://dashboard.knotapi.com) and retrieve your `client_id` and `secret`, which you will use as the basic auth username and password for your API key respectively. Note that your `client_id` and `secret` vary between  the`development` and `production` environments.
  </Accordion>

  <Accordion title="Call the API to create a session" icon="code">
    With your `client_id` and `secret` for the `development` environment, call [Create Session](/api-reference/sessions/create-session) to create a session used when invoking the SDK.
  </Accordion>

  <Accordion title="Install the SDK" icon="file-import">
    Install and import an SDK of your choosing, for example on iOS [here](/sdk/ios). If you are using the Web SDK, make sure to allowlist your application's domains for the `development` and `production` environments in your [Customer Dashboard](https://dashboard.knotapi.com).
  </Accordion>

  <Accordion title="Initialize the SDK" icon="play">
    Initialize the SDK with the `session_id` retrieved from [Create Session](/api-reference/sessions/create-session). The SDK is where users will interact with the Knot UI to authenticate to various merchants. All login flows, including step-up authentication, are handled with the SDK. Users will see real-time feedback as they progress through authenticating with a merchant.
  </Accordion>
</AccordionGroup>

## Handle Events

<AccordionGroup>
  <Accordion title="Handle SDK callbacks" icon="arrow-right">
    Handle `onSuccess`, `onError`, `onExit`, and `onEvent` SDK callbacks to be notified of client-side events.
  </Accordion>

  <Accordion title="Subscribe to webhooks" icon="webhook">
    Subscribe to [webhooks](/webhooks) so your backend can be notified about user-generated events, as well as asynchronous processes.

    <Note>
      If you fail to receive a webhook, you can call [Get Merchant Accounts](/api-reference/accounts/get-accounts) to determine whether a user previously attempted to switch their card with a given merchant. Pass `type: card_switcher` in the request and capture the `last_user_action` object.
    </Note>
  </Accordion>
</AccordionGroup>

## Switch a Card

<AccordionGroup>
  <Accordion title="Switch a card" defaultOpen icon="credit-card">
    Post card information to [Switch Card](/api-reference/products/card-switcher/switch-card) or [Switch Card (JWE)](/api-reference/products/card-switcher/switch-card-jwe) within 15 seconds of receiving  the [`AUTHENTICATED`](/link/webhook-events/authenticated) webhook when `send_card: true`, fired after a user authenticates to a merchant account. You can read more about sending card data to Knot [here](/card-switcher/sending-card-data).
  </Accordion>
</AccordionGroup>


webhook events 
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.knotapi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CARD_UPDATED

> Fired when a card is updated in a merchant account.

Fired when a card is updated in a merchant account.


## OpenAPI

````yaml api-reference/openapi.json webhook card-updated
openapi: 3.1.0
info:
  title: Knot API
  description: An API to interact with the Knot merchant connectivity platform.
  version: 1.0.0
servers:
  - url: https://development.knotapi.com
    description: Development server
security:
  - basicAuth: []
paths: {}
components:
  securitySchemes:
    basicAuth:
      type: http
      scheme: basic
      description: >-
        Basic authentication header of the form `Basic <encoded-value>`, where
        `<encoded-value>` is the base64-encoded string `username:password`. Use
        your `client_id` as the `username` and your `secret` as the `password`
        value.

````
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.knotapi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CARD_FAILED

> Fired when a card failed to be updated in a merchant account.

Fired when a card failed to be updated in a merchant account. The reason is specified in the `reason` field.

### Failure Reasons

| Reason                                          | **Description**                                                                                                                                |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `account`                                       | The user's merchant account has an issue (e.g. a foreign account).                                                                             |
| `card`                                          | The user's card information has an issue (e.g. incorrect phone #, incorrect billing address, unsupported card type, etc.).                     |
| `card expired`                                  | The user's card is expired.                                                                                                                    |
| `card in use`                                   | The card is already in use in another account.                                                                                                 |
| `insufficient funds`                            | The user's depository account associated with their card does not have sufficient funds to cover the pre-authorization hold from the merchant. |
| `subscription`                                  | The user's merchant account does not have an active subscription.                                                                              |
| `subscription admin`                            | The user does not have the necessary authorization to update the payment method in the merchant account.                                       |
| `third-party payment method on subscription`    | The user pays for the merchant's service through a 3rd party merchant account (e.g. Spotify through Hulu).                                     |
| `too close to end of billing cycle`             | The user's billing cycle date is too close.                                                                                                    |
| `too many attempts`                             | The user attempted to enter their login credentials (e.g. username, password, OTP) to the merchant account too many times.                     |
| `credentials`                                   | The user entered incorrect credentials when logging in to the merchant.                                                                        |
| `otp`                                           | The user entered an incorrect OTP code when logging in to the merchant.                                                                        |
| `credentials timeout`                           | The user did not enter their login credentials to the merchant account in a certain period of time.                                            |
| `otp timeout`                                   | The user did not enter their otp code to the merchant account in a certain period of time.                                                     |
| `questions timeout`                             | The user did not enter the answers to the security questions for the merchant account in a certain period of time.                             |
| `zip timeout`                                   | The user did not enter their zip code associated with their merchant account in a certain period of time.                                      |
| `session not authenticated`                     | Knot could not authenticate to the user's merchant account.                                                                                    |
| `did not receive payment method information`    | Knot did not receive any card information.                                                                                                     |
| `could not handle payment method information`   | Knot encountered an error handling the user's card information once received.                                                                  |
| `could not retrieve payment method information` | Knot was unsuccessful in retrieving payment method information from from a direct processor integration.                                       |
| `other`                                         | An unknown issue was encountered.                                                                                                              |


## OpenAPI

````yaml api-reference/openapi.json webhook card-failed
openapi: 3.1.0
info:
  title: Knot API
  description: An API to interact with the Knot merchant connectivity platform.
  version: 1.0.0
servers:
  - url: https://development.knotapi.com
    description: Development server
security:
  - basicAuth: []
paths: {}
components:
  securitySchemes:
    basicAuth:
      type: http
      scheme: basic
      description: >-
        Basic authentication header of the form `Basic <encoded-value>`, where
        `<encoded-value>` is the base64-encoded string `username:password`. Use
        your `client_id` as the `username` and your `secret` as the `password`
        value.

````
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.knotapi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# AUTHENTICATED

> Fired when the authentication to a merchant is successful.

Fired when the authentication to a merchant is successful.


## OpenAPI

````yaml api-reference/openapi.json webhook authenticated
openapi: 3.1.0
info:
  title: Knot API
  description: An API to interact with the Knot merchant connectivity platform.
  version: 1.0.0
servers:
  - url: https://development.knotapi.com
    description: Development server
security:
  - basicAuth: []
paths: {}
components:
  securitySchemes:
    basicAuth:
      type: http
      scheme: basic
      description: >-
        Basic authentication header of the form `Basic <encoded-value>`, where
        `<encoded-value>` is the base64-encoded string `username:password`. Use
        your `client_id` as the `username` and your `secret` as the `password`
        value.

````
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.knotapi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# MERCHANT_STATUS_UPDATE

> Fired when a merchant becomes available or unavailable.

<Info>
  Listening to this event is only necessary if you intend to display and allow users to select various merchants natively inside your app.
</Info>

Fired when the availability of a merchant changes on the Knot platform (even if temporarily), including when a brand new merchant is made available for the first time.

Availability is unique to product types, platforms, and minimum versions of the SDK. As such, the event is emitted independently for each product `type` and `platform`. Particularly if you are implementing multiple of Knot's products, you should consider the `type` property to determine whether a merchant is available for a given product, as availability can differ.

This event does not include a `session_id`, which is relevant when generating a hash map for webhook verification, as described in [Webhook Verification](/webhooks#webhook-verification).


## OpenAPI

````yaml api-reference/openapi.json webhook merchant-status-update
openapi: 3.1.0
info:
  title: Knot API
  description: An API to interact with the Knot merchant connectivity platform.
  version: 1.0.0
servers:
  - url: https://development.knotapi.com
    description: Development server
security:
  - basicAuth: []
paths: {}
components:
  securitySchemes:
    basicAuth:
      type: http
      scheme: basic
      description: >-
        Basic authentication header of the form `Basic <encoded-value>`, where
        `<encoded-value>` is the base64-encoded string `username:password`. Use
        your `client_id` as the `username` and your `secret` as the `password`
        value.

````
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.knotapi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Sending Card Data

> Learn how to securely send card data to Knot using JWE encryption, vault providers, or processor integrations.

## Overview

There are a few options for how you can send card data to Knot when integrating the CardSwitcher product. The first option is to to send the card data encrypted in a JWE, the second option is to send the card data in JSON to a secure endpoint controlled by a vault provider, and the third is to rely on one of Knot's direct processor integrations.

No option is more or less secure than the other, all maintain strict handling of the card data to comply with PCI guidelines, and all are valid options for sending card data to Knot.

## Send Encrypted Data Directly to Knot

<Tip>This option is recommended.</Tip>

In this option, you can encrypt the JSON payload of card data in a JWE format prior to sending it to Knot.

1. Get a JWE public key from Knot's [Retrieve JWK](/api-reference/products/card-switcher/retrieve-jwk) endpoint.
2. Encrypt the JSON string payload of the card data with the JWE public key (referenced [here](/api-reference/products/card-switcher/retrieve-jwk)).
3. Send the encrypted payload to [Switch Card (JWE)](/api-reference/products/card-switcher/switch-card-jwe).
4. Knot sends the encrypted data (the JWE) to a PCI-compliant vendor's environment.
5. Knot receives an alias associated with the encrypted card data.

Card data is never processed or stored outside PCI-compliant vendor environments. After card data is used for a card switch, it is explicitly deleted from the PCI-compliant vendor's vault within milliseconds.

### VGS JWE Encryption

If you already have a vault set up with Very Good Security (VGS), you can manipulate the payload and send the JWE directly from your VGS vault via an outbound route to the [Switch Card (JWE)](/api-reference/products/card-switcher/switch-card-jwe) endpoint. Please see the VGS StarLarky code sample below for guidance or reach out to the Knot team.

### Code Samples

Below are a number of code samples demonstrating how to structure and encrypt a JWE:

<CodeGroup>
  ```typescript expandable TypeScript icon="node-js" theme={"system"}
  import { CompactEncrypt, importJWK, JWK } from 'jose';

  const KNOT_BASE = 'https://development.knotapi.com';

  function basicAuthHeader(clientId: string, secret: string): string {
      const creds = Buffer.from(`${clientId}:${secret}`, 'utf8').toString('base64');
      return `Basic ${creds}`;
  }

  /**
   * GetKey gets the JWK associated with your client ID from the Knot API.
   * The implementation follows the steps outlined in the KnotAPI documentation:
   * https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk
   */
  export async function getKey(): Promise<JWK> {
      const clientId = process.env.KNOT_CLIENT_ID || '';
      const secret = process.env.KNOT_SECRET || '';

      if (!clientId || !secret) {
          throw new Error('KNOT_CLIENT_ID and KNOT_SECRET must be set in the environment.');
      }

      const resp = await fetch(`${KNOT_BASE}/jwe/key`, {
          method: 'GET',
          headers: {
              Authorization: basicAuthHeader(clientId, secret),
              Accept: 'application/json',
          },
      });

      if (!resp.ok) {
          const text = await resp.text().catch(() => '');
          throw new Error(`Failed to fetch JWK (${resp.status}): ${text}`);
      }

      const jwk = (await resp.json()) as JWK;
      return jwk;
  }

  /**
   * encryptData encrypts the card data using the provided JWK, the JWE must contain the JWK's "kid" and "alg" parameters to be considered valid.
   * The implementation follows the steps outlined in the KnotAPI documentation:
   * https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk#building-the-jwe
   * You can also opt to implement these RFC's manually instead of using a library:
   * https://datatracker.ietf.org/doc/html/rfc7516
   * https://datatracker.ietf.org/doc/html/rfc7517
   * https://datatracker.ietf.org/doc/html/rfc7518
   * https://datatracker.ietf.org/doc/html/rfc7638
   */
  export async function encryptData(cardData: unknown, jwk: JWK): Promise<string> {
      const alg = jwk.alg;
      if (!alg) {
          throw new Error('JWK is missing "alg" (required).');
      }

      // Import the public key from JWK for encryption
      // jose infers the right key type/algorithm from JWK fields
      const publicKey = await importJWK(jwk, alg);

      const plaintext = new TextEncoder().encode(JSON.stringify(cardData));

      const jwe = await new CompactEncrypt(plaintext)
          .setProtectedHeader({
              alg,
              enc: 'A256GCM',
              ...(jwk.kid ? { kid: jwk.kid } : {}),
          })
          .encrypt(publicKey);

      return jwe;
  }

  /**
   * submitJWE Submits the JWE to the Knot API for an active task.
   * The implementation follows the steps outlined in the KnotAPI documentation:
   * https://docs.knotapi.com/api-reference/products/card-switcher/switch-card-jwe
   */
  export async function submitJWE(taskId: string, jwe: string): Promise<void> {
      const clientId = process.env.KNOT_CLIENT_ID || '';
      const secret = process.env.KNOT_SECRET || '';
      if (!clientId || !secret) {
          throw new Error('KNOT_CLIENT_ID and KNOT_SECRET must be set in the environment.');
      }

      console.log(`Submitting JWE: ${jwe}`);

      const resp = await fetch(`${KNOT_BASE}/card`, {
          method: 'POST',
          headers: {
              Authorization: basicAuthHeader(clientId, secret),
              'Content-Type': 'application/json',
              Accept: 'application/json',
          },
          body: JSON.stringify({ task_id: taskId, jwe }),
      });

      const text = await resp.text().catch(() => '');
      // Try parse JSON if possible for error_message
      let parsed: Record<string, unknown> | null = null;
      try { parsed = text ? JSON.parse(text) : null; } catch {}

      if (!resp.ok) {
          const msg = parsed?.error_message ?? (text || `HTTP ${resp.status}`);
          throw new Error(String(msg));
      }

      const errorMessage = (parsed?.error_message as string | undefined) ?? undefined;
      if (errorMessage) {
          throw new Error(errorMessage);
      }
  }

  async function main() {
      /**
       * Hardcoded card data for demonstration purposes.
       * You should use your own card data.
       * See the KnotAPI documentation for more information:
       * https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk#building-the-jwe
       */
      const cardData = {
          user: {
              name: {
                  first_name: 'Ada',      // Max length: 255
                  last_name: 'Lovelace',  // Max length: 255
              },
              address: {
                  street: '100 Main Street', // Max length: 46
                  street2: '#100',           // Max length: 46
                  city: 'NEW YORK',          // Max length: 32
                  region: 'NY',              // Must be an ISO 3166-2 sub-division code
                  postal_code: '12345',      // Min length: 5, Max length: 10
                  country: 'US',             // Must be an ISO 3166-1 alpha-2 code
              },
              phone_number: '+11234567890', // Must be in E.164 format
          },
          card: {
              number: '4242424242424242',   // Card number
              expiration: '08/2030',        // MM/YYYY or MM/YY format
              cvv: '012',                   // Max length: 4
          },
      };

      const jwk = await getKey();
      const jwe = await encryptData(cardData, jwk);

      await submitJWE('123456', jwe);
  }

  if (require.main === module) {
      main().catch((err) => {
          console.error(err);
          process.exit(1);
      });
  }
  ```

  ```python expandable Python icon="python"  theme={"system"}
  from __future__ import annotations

  import json
  import os
  from typing import Any, Dict

  import requests
  from jose import jwe  # python-jose
  # pip install "python-jose[cryptography]" requests

  KNOT_BASE = "https://development.knotapi.com"


  def _auth_tuple() -> tuple[str, str]:
      cid = os.getenv("KNOT_CLIENT_ID")
      sec = os.getenv("KNOT_SECRET")
      if not cid or not sec:
          raise RuntimeError("KNOT_CLIENT_ID or KNOT_SECRET is missing in the environment")
      return cid, sec


  def get_key() -> Dict[str, Any]:
      """
      GetKey gets the JWK associated with your client ID from the Knot API.
      The implementation follows the steps outlined in the KnotAPI documentation:
      https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk
      Returns the JWK JSON as a Python dict (suitable for python-jose).
      """
      resp = requests.get(f"{KNOT_BASE}/jwe/key", auth=_auth_tuple(), timeout=30)
      if not resp.ok:
          raise RuntimeError(f"GetKey failed: {resp.status_code} {resp.text}")
      jwk = resp.json()  # python-jose accepts a JWK dict as the key parameter
      return jwk


  def encrypt_data(card_data: Dict[str, Any], jwk_dict: Dict[str, Any]) -> str:
      """
      encrypt_data encrypts the card data using the provided JWK, the JWE must contain the JWK's "kid" and "alg" parameters to be considered valid.
      The implementation follows the steps outlined in the KnotAPI documentation:
      https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk#building-the-jwe
      You can also opt to implement these RFC's manually instead of using a library:
      https://datatracker.ietf.org/doc/html/rfc7516
      https://datatracker.ietf.org/doc/html/rfc7517
      https://datatracker.ietf.org/doc/html/rfc7518
      https://datatracker.ietf.org/doc/html/rfc7638
      """
      plaintext = json.dumps(card_data).encode("utf-8")
      return jwe.encrypt(
          plaintext,
          jwk_dict,          # JWK dict (python-jose derives the key)
          algorithm=jwk_dict.get("alg"),
          encryption="A256GCM",
          kid=jwk_dict.get("kid")
      ).decode("utf-8")

  def submit_jwe(task_id: str, compact_jwe: str) -> None:
      """
      submit_jwe Submits the JWE to the Knot API for an active task.
      The implementation follows the steps outlined in the KnotAPI documentation:
      https://docs.knotapi.com/api-reference/products/card-switcher/switch-card-jwe
      """
      payload = {"task_id": task_id, "jwe": compact_jwe}
      resp = requests.post(
          f"{KNOT_BASE}/card",
          auth=_auth_tuple(),
          json=payload,
          headers={"Content-Type": "application/json"},
          timeout=30,
      )

      body_text = resp.text or ""
      try:
          parsed = resp.json() if body_text else {}
      except Exception:
          parsed = {}

      if not resp.ok:
          msg = parsed.get("error_message") or f"{resp.status_code} {resp.reason}"
          raise RuntimeError(f"SubmitJWE failed: {msg}")

      if parsed.get("error_message"):
          raise RuntimeError(parsed["error_message"])


  def main() -> None:
      card_data: Dict[str, Any] = {
          "user": {
              "name": {
                  "first_name": "Ada",      # Max length: 255
                  "last_name":  "Lovelace", # Max length: 255
              },
              "address": {
                  "street":      "100 Main Street", # Max length: 46
                  "street2":     "#100",            # Max length: 46
                  "city":        "NEW YORK",        # Max length: 32
                  "region":      "NY",              # Must be an ISO 3166-2 sub-division code
                  "postal_code": "12345",           # Min length: 5, Max length: 10
                  "country":     "US",              # Must be an ISO 3166-1 alpha-2 code
              },
              "phone_number": "+11234567890",       # Must be in E.164 format
          },
          "card": {
              "number":     "4242424242424242",     # Card number
              "expiration": "08/2030",              # MM/YYYY or MM/YY format
              "cvv":        "012",                   # Max length: 4
          },
      }

      jwk_dict = get_key()
      compact_jwe = encrypt_data(card_data, jwk_dict)
      submit_jwe("123456", compact_jwe)


  if __name__ == "__main__":
      main()
  ```

  ```go expandable Go icon="golang" theme={"system"}
  package main

  import (
  	"bytes"
  	"encoding/json"
  	"fmt"
  	"io"
  	"net/http"
  	"os"

  	"github.com/lestrrat-go/jwx/v3/jwe"
  	"github.com/lestrrat-go/jwx/v3/jwk"
  )

  /*
      GetKey gets the JWK associated with your client ID from the Knot API.
      The implementation follows the steps outlined in the KnotAPI documentation:
      https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk
  */
  func GetKey() (jwk.Key, error) {
  	req, err := http.NewRequest(http.MethodGet, "https://development.knotapi.com/jwe/key", nil)
  	if err != nil {
  		return nil, err
  	}

  	req.SetBasicAuth(os.Getenv("KNOT_CLIENT_ID"), os.Getenv("KNOT_SECRET"))
  	resp, err := http.DefaultClient.Do(req)
  	if err != nil {
  		return nil, err
  	}
  	defer resp.Body.Close()

  	body, err := io.ReadAll(resp.Body)
  	if err != nil {
  		return nil, err
  	}

  	parsedKey, err := jwk.ParseKey(body)
  	if err != nil {
  		return nil, err
  	}
  	return parsedKey, nil
  }

  /*
      EncryptData encrypts the card data using the provided JWK, the JWE must contain the JWK's "kid" and "alg" parameters to be considered valid.
      The implementation follows the steps outlined in the KnotAPI documentation:
      https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk#building-the-jwe
      You can also opt to implement these RFC's manually instead of using a library:
      https://datatracker.ietf.org/doc/html/rfc7516
      https://datatracker.ietf.org/doc/html/rfc7517
      https://datatracker.ietf.org/doc/html/rfc7518
      https://datatracker.ietf.org/doc/html/rfc7638
  */
  func EncryptData(cardData map[string]any, parsedKey jwk.Key) ([]byte, error) {
  	plaintext, err := json.Marshal(cardData)
  	if err != nil {
  		return nil, err
  	}

  	algo, ok := parsedKey.Algorithm()
  	if !ok {
  		return nil, fmt.Errorf("key does not have an algorithm")
  	}
  	return jwe.Encrypt(plaintext, jwe.WithKey(algo, parsedKey))
  }

  /*
      SubmitJWE Submits the JWE to the Knot API for an active task.
      The implementation follows the steps outlined in the KnotAPI documentation:
      https://docs.knotapi.com/api-reference/products/card-switcher/switch-card-jwe
  */
  func SubmitJWE(taskId string, cipherText []byte) error {
  	payload := map[string]string{
  		"task_id": taskId,
  		"jwe":     string(cipherText),
  	}
  	payloadBytes, err := json.Marshal(&payload)
  	if err != nil {
  		return err
  	}

  	req, err := http.NewRequest(http.MethodPost, "https://development.knotapi.com/card", bytes.NewReader(payloadBytes))
  	if err != nil {
  		return err
  	}

  	req.SetBasicAuth(os.Getenv("KNOT_CLIENT_ID"), os.Getenv("KNOT_SECRET"))
  	resp, err := http.DefaultClient.Do(req)
  	if err != nil {
  		return err
  	}
  	defer resp.Body.Close()

  	body, err := io.ReadAll(resp.Body)
  	if err != nil {
  		return err
  	}

  	parsedBody := map[string]string{}
  	err = json.Unmarshal(body, &parsedBody)
  	if err != nil {
  		return err
  	}

  	errorMessage, ok := parsedBody["error_message"]
  	if ok {
  		return fmt.Errorf(errorMessage)
  	}
  	return nil
  }

  func main() {
  	/*
  		Hardcoded card data for demonstration purposes.
  		You should use your own card data.
  		See the KnotAPI documentation for more information:
  		https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk#building-the-jwe
  	*/
  	cardData := map[string]any{
  		"user": map[string]any{
  			"name": map[string]string{
  				"first_name": "Ada",      // Max length: 255
  				"last_name":  "Lovelace", // Max length: 255
  			},
  			"address": map[string]string{
  				"street":      "100 Main Street", // Max length: 46
  				"street2":     "#100",            // Max length: 46
  				"city":        "NEW YORK",        // Max length: 32
  				"region":      "NY",              // Must be an ISO 3166-2 sub-division code
  				"postal_code": "12345",           // Min length: 5, Max length: 10
  				"country":     "US",              // Must be an ISO 3166-1 alpha-2 code
  			},
  			"phone_number": "+11234567890", // Must be in E.164 format
  		},
  		"card": map[string]string{
  			"number":     "4242424242424242",
  			"expiration": "08/2030", // MM/YYYY or MM/YY format
  			"cvv":        "012",     // Max length: 4
  		},
  	}

  	parsedKey, err := GetKey()
  	if err != nil {
  		panic(err)
  	}

  	cipherText, err := EncryptData(cardData, parsedKey)
  	if err != nil {
  		panic(err)
  	}

  	err = SubmitJWE("123456", cipherText)
  	if err != nil {
  		panic(err)
  	}
  }
  ```

  ```python expandable VGS StarLarky icon="star" theme={"system"}
  load('@stdlib//json', 'json')
  load('@vgs//vault', 'vault')
  load('@vendor//jose/jwe', 'jwe')

  def _reveal_card_fields(card):
      return {
          "number": vault.reveal(card["number"]),
          "expiration": vault.reveal(card["expiration"]),
          "cvv": vault.reveal(card["cvv"]),
      }

  def _encrypt_jwe(jwk, plaintext_bytes):
      """
      _encrypt_jwe encrypts the card data using the provided JWK, the JWE must contain the JWK's "kid" and "alg" parameters to be considered valid.
      """
      return jwe.encrypt(
          plaintext_bytes,
          jwk,
          algorithm=jwk["alg"],
          encryption="A256GCM",
          kid=jwk["kid"]
      )

  def process(input, ctx):
      # input.body is a string (JSON). Example:
      # {
      #   "jwk": { "kty": "...", "alg": "RSA-OAEP-256", "n": "...", "e": "...", "kid": "..." }, (retrieved from https://development.knotapi.com/jwe/key)
      #   "user": {
      #     "name": {
      #       "first_name": "Ada",      # Max length: 255
      #       "last_name":  "Lovelace"  # Max length: 255
      #     },
      #     "address": {
      #       "street":      "100 Main Street", # Max length: 46
      #       "street2":     "#100",            # Max length: 46
      #       "city":        "NEW YORK",        # Max length: 32
      #       "region":      "NY",              # ISO 3166-2 sub-division
      #       "postal_code": "12345",           # Min 5, Max 10
      #       "country":     "US"               # ISO 3166-1 alpha-2
      #     },
      #     "phone_number": "+11234567890"      # E.164
      #   },
      #   "card": {
      #     "number":     "tok_sandbox_...",
      #     "expiration": "tok_sandbox_...",    # MM/YYYY MM/YY
      #     "cvv":        "tok_sandbox_..."     # Max length: 4
      #   }
      # }
      body = json.loads(input.body)

      jwk = body["jwk"]
      user = body["user"]
      card = body["card"]

      revealed_card = _reveal_card_fields(card)
      card_data = {"user": user, "card": revealed_card}

      plaintext = json.dumps(card_data).encode("utf-8")
      encrypted_jwe = _encrypt_jwe(jwk, plaintext)

      input.body = encrypted_jwe
      input.headers["Content-Type"] = "text/plain"

      return input
  ```

  ```java expandable Java icon="java" theme={"system"}
  package com.knotapi;

  import com.fasterxml.jackson.core.type.TypeReference;
  import com.fasterxml.jackson.databind.ObjectMapper;

  import com.nimbusds.jose.*;
  import com.nimbusds.jose.crypto.*;
  import com.nimbusds.jose.jwk.*;

  import java.net.URI;
  import java.net.http.HttpClient;
  import java.net.http.HttpRequest;
  import java.net.http.HttpResponse;
  import java.nio.charset.StandardCharsets;
  import java.util.Base64;
  import java.util.LinkedHashMap;
  import java.util.Map;

  public class Main {
      private static final String KNOT_BASE = "https://development.knotapi.com";
      private static final ObjectMapper MAPPER = new ObjectMapper();
      private static final HttpClient HTTP = HttpClient.newHttpClient();

      /** Get the JWK associated with your client ID from the Knot API.
       *  The implementation follows the steps outlined in the KnotAPI documentation:
       *  https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk
       */
      public static JWK getKey() throws Exception {
          String id = System.getenv("KNOT_CLIENT_ID");
          String secret = System.getenv("KNOT_SECRET");
          if (id == null || secret == null) {
              throw new IllegalStateException("KNOT_CLIENT_ID or KNOT_SECRET missing");
          }

          String basic = "Basic " + Base64.getEncoder()
                  .encodeToString((id + ":" + secret).getBytes(StandardCharsets.UTF_8));

          HttpRequest req = HttpRequest.newBuilder()
                  .uri(URI.create(KNOT_BASE + "/jwe/key"))
                  .header("Authorization", basic)
                  .GET()
                  .build();

          HttpResponse<String> resp = HTTP.send(req, HttpResponse.BodyHandlers.ofString());
          if (resp.statusCode() / 100 != 2) {
              throw new RuntimeException("GetKey failed: " + resp.statusCode() + " " + resp.body());
          }

          // Parse JWK directly from JSON string
          return JWK.parse(resp.body());
      }

      /** Select a JWEEncrypter that matches the provided JWK and alg. */
      private static JWEEncrypter encrypterFor(JWK jwk, JWEAlgorithm alg) throws Exception {
          // Always use a public key for asymmetric encryption
          if (jwk instanceof RSAKey) {
              RSAKey rsa = (RSAKey) ((RSAKey) jwk).toPublicJWK();
              return new RSAEncrypter(rsa);
          }
          if (jwk instanceof ECKey) {
              ECKey ec = (ECKey) ((ECKey) jwk).toPublicJWK();
              return new ECDHEncrypter(ec);
          }
          if (jwk instanceof OctetSequenceKey) {
              OctetSequenceKey oct = (OctetSequenceKey) jwk;
              byte[] keyBytes = oct.toByteArray();
              if (JWEAlgorithm.DIR.equals(alg)) {
                  return new DirectEncrypter(keyBytes);
              }
              return new AESEncrypter(keyBytes);
          }
          throw new JOSEException("Unsupported JWK type: " + jwk.getKeyType());
      }

      /** encryptData encrypts the card data using the provided JWK, the JWE must contain the JWK's "kid" and "alg" parameters to be considered valid.
       *  The implementation follows the steps outlined in the KnotAPI documentation:
       *  https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk#building-the-jwe
       *  You can also opt to implement these RFC's manually instead of using a library:
       *  https://datatracker.ietf.org/doc/html/rfc7516
       *  https://datatracker.ietf.org/doc/html/rfc7517
       *  https://datatracker.ietf.org/doc/html/rfc7518
       *  https://datatracker.ietf.org/doc/html/rfc7638
       */
      public static String encryptData(Map<String, Object> cardData, JWK jwk) throws Exception {
          byte[] plaintext = MAPPER.writeValueAsBytes(cardData);

          // Use alg from the JWK; enc = A256GCM (adjust if your server requires a different enc)
          if (jwk.getAlgorithm() == null) throw new IllegalStateException("JWK missing 'alg'");
          JWEAlgorithm alg = JWEAlgorithm.parse(jwk.getAlgorithm().getName());

          JWEHeader header = new JWEHeader.Builder(alg, EncryptionMethod.A256GCM)
                  .keyID(jwk.getKeyID()) // include kid if present
                  .contentType(null)     // no nested JWT
                  .build();

          JWEObject jwe = new JWEObject(header, new Payload(plaintext));
          JWEEncrypter encrypter = encrypterFor(jwk, alg);
          jwe.encrypt(encrypter);

          return jwe.serialize();
      }

      /** submitJWE Submits the JWE to the Knot API for an active task.
       *  The implementation follows the steps outlined in the KnotAPI documentation:
       *  https://docs.knotapi.com/api-reference/products/card-switcher/switch-card-jwe
       */
      public static void submitJWE(String taskId, String compactJWE) throws Exception {
          String id = System.getenv("KNOT_CLIENT_ID");
          String secret = System.getenv("KNOT_SECRET");
          if (id == null || secret == null) {
              throw new IllegalStateException("KNOT_CLIENT_ID or KNOT_SECRET missing");
          }

          String basic = "Basic " + Base64.getEncoder()
                  .encodeToString((id + ":" + secret).getBytes(StandardCharsets.UTF_8));

          Map<String, String> payload = Map.of(
                  "task_id", taskId,
                  "jwe", compactJWE
          );
          String json = MAPPER.writeValueAsString(payload);

          HttpRequest req = HttpRequest.newBuilder()
                  .uri(URI.create(KNOT_BASE + "/card"))
                  .header("Authorization", basic)
                  .header("Content-Type", "application/json")
                  .POST(HttpRequest.BodyPublishers.ofString(json))
                  .build();

          HttpResponse<String> resp = HTTP.send(req, HttpResponse.BodyHandlers.ofString());
          String body = resp.body();

          // Try to parse JSON body for error_message (even on non-2xx)
          Map<String, Object> parsed = Map.of();
          try {
              if (body != null && !body.isEmpty()) {
                  parsed = MAPPER.readValue(body, new TypeReference<Map<String, Object>>() {});
              }
          } catch (Exception ignored) {}

          if (resp.statusCode() / 100 != 2) {
              Object msg = parsed.getOrDefault("error_message", resp.statusCode() + " " + resp.body());
              throw new RuntimeException("SubmitJWE failed: " + msg);
          }
          if (parsed.containsKey("error_message")) {
              throw new RuntimeException(String.valueOf(parsed.get("error_message")));
          }
      }

      static void main() throws Exception {
          /**
           * Hardcoded card data for demonstration purposes.
           * You should use your own card data.
           * See the KnotAPI documentation for more information:
           * https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk#building-the-jwe
           */
          Map<String, Object> name = new LinkedHashMap<>();
          name.put("first_name", "Ada");       // Max length: 255
          name.put("last_name", "Lovelace");   // Max length: 255

          Map<String, Object> address = new LinkedHashMap<>();
          address.put("street", "100 Main Street"); // Max length: 46
          address.put("street2", "#100");           // Max length: 46
          address.put("city", "NEW YORK");          // Max length: 32
          address.put("region", "NY");              // ISO 3166-2 sub-division
          address.put("postal_code", "12345");      // Min 5, Max 10
          address.put("country", "US");             // ISO 3166-1 alpha-2

          Map<String, Object> user = new LinkedHashMap<>();
          user.put("name", name);
          user.put("address", address);
          user.put("phone_number", "+11234567890"); // E.164 format

          Map<String, Object> card = new LinkedHashMap<>();
          card.put("number", "4242424242424242");
          card.put("expiration", "08/2030"); // MM/YYYY or MM/YY
          card.put("cvv", "012");            // Max length: 4

          Map<String, Object> cardData = new LinkedHashMap<>();
          cardData.put("user", user);
          cardData.put("card", card);

          JWK jwk = getKey();
          String jwe = encryptData(cardData, jwk);
          submitJWE("123456", jwe);
      }
  }
  ```
</CodeGroup>

## Send Data to Secure Vault Provider

This option is often chosen by those integrating with Knot that already have a vault set up with a PCI-compliant vendor such as Very Good Security (VGS) or Basis Theory.

1. Set up a route to Knot's [Switch Card](/api-reference/products/card-switcher/switch-card) endpoint from the vault that stores card data at your PCI-compliant vendor.
2. When you receive the `AUTHENTICATED` webhook, make a request to the vault.
3. The vault provider will send the necessary card data to Knot's [Switch Card](/api-reference/products/card-switcher/switch-card) endpoint in JSON.
4. Knot receives the card data to the aforementioned endpoint. **This endpoint is controlled by Knot's PCI-compliant vendor which stores the data and proxies it to Knot via an alias.**

Card data is never processed or stored outside PCI-compliant vendor environments. After card data is used for a card switch, it is explicitly deleted from the PCI-compliant vendor's vault within milliseconds.

You can also request to enable [Mutual Transport Layer Security (mTLS)](/api-reference/mTLS) for the [Switch Card](/api-reference/products/card-switcher/switch-card) endpoint as an additional security measure if desired.

### VGS 1-Click Route Setup

Knot partners with [VGS](https://www.verygoodsecurity.com/) (a PCI-compliant vendor) to streamline the process of sending card data in a PCI-compliant manner as part of your integration with Knot.

Within your VGS account online, you can setup an outbound route to Knot's [Switch Card](/api-reference/products/card-switcher/switch-card) endpoint. VGS specifies how to set up an outbound connection to a 3rd party (in this case Knot) [here](https://www.verygoodsecurity.com/docs/guides/outbound-connection#outbound-connection). Doing so will allow you to automatically route card data stored in your VGS vault to Knot. To make this process even easier, in the "Addons" section of your vault in your VGS account online, you will find a set of "route templates." You can search for and select the "KnotAPI" route template to get started.

<img src="https://mintcdn.com/knot/uGXtPszCtMbiXf0x/images/vgs-addons.jpg?fit=max&auto=format&n=uGXtPszCtMbiXf0x&q=85&s=eece0901a4766df3d79da3983923ed3f" alt="" data-og-width="3456" width="3456" data-og-height="1704" height="1704" data-path="images/vgs-addons.jpg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/knot/uGXtPszCtMbiXf0x/images/vgs-addons.jpg?w=280&fit=max&auto=format&n=uGXtPszCtMbiXf0x&q=85&s=9242388dbb2441317df6f1f24b5c3aa2 280w, https://mintcdn.com/knot/uGXtPszCtMbiXf0x/images/vgs-addons.jpg?w=560&fit=max&auto=format&n=uGXtPszCtMbiXf0x&q=85&s=0dc9f831d63f61ca870e0c3b81d2f79c 560w, https://mintcdn.com/knot/uGXtPszCtMbiXf0x/images/vgs-addons.jpg?w=840&fit=max&auto=format&n=uGXtPszCtMbiXf0x&q=85&s=dc427a85a4c587e8e28c70e3a30b6b29 840w, https://mintcdn.com/knot/uGXtPszCtMbiXf0x/images/vgs-addons.jpg?w=1100&fit=max&auto=format&n=uGXtPszCtMbiXf0x&q=85&s=c0684e7364cbd60c60a1381833cb4abf 1100w, https://mintcdn.com/knot/uGXtPszCtMbiXf0x/images/vgs-addons.jpg?w=1650&fit=max&auto=format&n=uGXtPszCtMbiXf0x&q=85&s=5519a27754e6ca90c876a0e71b0c7933 1650w, https://mintcdn.com/knot/uGXtPszCtMbiXf0x/images/vgs-addons.jpg?w=2500&fit=max&auto=format&n=uGXtPszCtMbiXf0x&q=85&s=b42291337439985c5a73ed8312e1deb4 2500w" />

## Direct Processor Integrations

### Unit

With this option, you can allow Knot to retrieve the card data directly from Unit if you use their software as your issuer processor. More on this integration [here](/card-switcher/processor-integrations/unit).

### I2C

With this option, you can allow Knot to retrieve the card data directly from Unit if you use their software as your issuer processor. More on this integration [here](/card-switcher/processor-integrations/i2c).
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.knotapi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Testing

> Use test credentials and best practices to test CardSwitcher functionality in development and production environments.

## Development

The below set of credentials allow you to test logging in to merchant accounts and simulate various scenarios.

| Scenario                  | Description                                                                                                 | Username             | Password    |
| :------------------------ | :---------------------------------------------------------------------------------------------------------- | :------------------- | :---------- |
| Successful authentication | Simulates a successful authentication to a merchant account.                                                | `user_good`          | `pass_good` |
| One-time password (OTP)   | Simulates an authentication that requires an OTP. `1234` for a valid OTP and `0000` for an invalid OTP.     | `user_good`          | `pass_otp`  |
| Invalid credentials       | Simulates a failed authentication due to invalid credentials.                                               | `credentials`        | `failed`    |
| Account failure           | Simulates a failed authentication due to an issue with the user's merchant account.                         | `account`            | `failed`    |
| Merchant failure          | Simulates a failed authentication due to an issue with the merchant.                                        | `merchant`           | `failed`    |
| Too many attempts         | Simulates a failed authentication due to too many consecutive, failed login attempts.                       | `too many attempts`  | `failed`    |
| Card not supported        | Simulates a failed card switch due to the card not being supported by the merchant.                         | `card not supported` | `failed`    |
| Card expired              | Simulates a failed card switch due to the card having insufficient funds (for debit & prepaid cards).       | `insufficient funds` | `failed`    |
| No subscription           | Simulates a failed card switch due to the user's lack of a paid subscription with the merchant.             | `subscription`       | `failed`    |
| Subscription admin        | Simulates a failed card switch due to the user's account lacking the proper permissions to update the card. | `subscription admin` | `failed`    |

## Production

Below are a set of best practices when testing Knot in production.

1. Ensure testing occurs from devices in the U.S. and with merchant accounts based in the U.S. International devices and accounts are not enabled.
2. Replicate real-life behavior:
   1. Do not attempt to provision multiple cards to the same merchant account multiple consecutive times in a short period. The merchant's fraud rules are likely to prevent this behavior.
   2. Do not attempt to provision the same card to multiple different accounts with the same merchant. Similar to the above, the merchant's fraud rule are likely to prevent this behavior.
   3. Do not attempt to log in to the same merchant multiple consecutive times in a short time frame on the same device.
   4. Do not attempt to log into the a merchant account while on a company VPN.
3. Ensure the proper personal information (beyond the card information) is being provided to Knot (typically in the call to [Switch Card](/api-reference/products/card-switcher/switch-card)). Many merchants require first name, last name, billing address, and/or phone number to update a card-on-file. The billing address may need to pass Address Verification Service (AVS) checks by the merchant. This information can come from a number of different places depending on your integration with Knot or your server's storage/retrieval of this information from other third parties (e.g. bank partner, processor, etc.).
4. Ensure the card that is being sent to Knot is active (i.e. not locked/frozen) and has sufficient funds (if a debit card). Many merchants attempt a small authorization hold of `$0.01` or `$1.00` on debit or prepaid cards.
5. If you are testing Knot's web SDK, ensure you are not logged in to the merchant in another browser tab at the same time as when logging in via the SDK.
6. If you choose to check if your card is actually provisioned to the merchant account after completing the flow in the Knot SDK:
   1. Allow a bit of time for the merchant account to update. Certain merchants can take a few minutes for the new card to be reflected in the account.
   2. Hard refresh the merchant account page and/or log out and log in again to see the newly provisioned card.


api 



> ## Documentation Index
> Fetch the complete documentation index at: https://docs.knotapi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Retrieve JWK

> Retrieve a public key in JWK format.

### Building the JWE

<Tip>See code samples [here](/card-switcher/sending-card-data#code-samples) for how to structure and encrypt the JWE in various programming languages.</Tip>

You can encrypt the payload you'll provide to the [Switch Card (JWE)](https://docs.knotapi.com/api-reference/products/card-switcher/switch-card-jwe) endpoint using your JWE public key. The JWE specifications are the following:

1. RSA 2048 certificate in JWK format
2. RSA-OAEP-256 as key encryption algorithm
3. A256GCM as content encryption algorithm

The JWE value should be a JSON string with the structure below. Additionally, in the development environment, the below values are sufficient to pass validation when building the JWE.

```json JSON icon="file-brackets-curly" theme={"system"}
{
    "user": {
        "name": {
            "first_name": "Ada", // Max length: 255
            "last_name": "Lovelace" // Max length: 255
        },
        "address": {
            "street": "100 Main Street", // Max length: 46
            "street2": "#100", // Max length: 46
            "city": "NEW YORK", // Max length: 32
            "region": "NY", // Must be an ISO 3166-2 sub-division code
            "postal_code": "12345", // Min length: 5, Max length: 10
            "country": "US" // Must be an ISO 3166-1 alpha-2 code
        },
        "phone_number": "+11234567890" // Must be in E.164 format
    },
    "card": {
        "number": "4242424242424242",
        "expiration": "08/2030", // MM/YYYY or MM/YY format
        "cvv": "012" // Max length: 4
    }
}
```


## OpenAPI

````yaml GET /jwe/key
openapi: 3.1.0
info:
  title: Knot API
  description: An API to interact with the Knot merchant connectivity platform.
  version: 1.0.0
servers:
  - url: https://development.knotapi.com
    description: Development server
security:
  - basicAuth: []
paths:
  /jwe/key:
    get:
      description: Retrieve a public key in JWK format.
      operationId: jwe_get_public_key
      responses:
        '200':
          description: Successful request.
          content:
            application/json:
              schema:
                type: object
                properties:
                  alg:
                    type: string
                    description: Algorithm intended for use with the key.
                    example: RSA-OAEP-256
                  e:
                    type: string
                    description: >-
                      Exponent value for the RSA public key in Base64 URL
                      format.
                    example: ...
                  key_ops:
                    type: array
                    items:
                      type: string
                    description: Operation permitted for the key.
                    example:
                      - encrypt
                  kid:
                    type: string
                    description: Unique identifier for the kid.
                    example: ...
                  kty:
                    type: string
                    description: Type of key.
                    example: RSA
                  'n':
                    type: string
                    description: Modulus value for the RSA public key in Base64 URL format.
                    example: ...
                  use:
                    type: string
                    description: Intended use of the key.
                    example: enc
        '401':
          description: Unauthorized request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                AuthFailed:
                  summary: Auth failed
                  value:
                    error_type: INVALID_INPUT
                    error_code: INVALID_API_KEYS
                    error_message: Invalid client_id or secret provided.
components:
  schemas:
    Error:
      type: object
      properties:
        error_type:
          type: string
          description: Type of error.
          enum:
            - INVALID_INPUT
            - INVALID_REQUEST
            - USER_ERROR
            - SESSION_ERROR
            - MERCHANT_ACCOUNT_ERROR
            - MERCHANT_ERROR
            - TRANSACTION_ERROR
            - CART_ERROR
          example: INVALID_REQUEST
        error_code:
          type: string
          description: Error code.
          enum:
            - INVALID_API_KEYS
            - INVALID_FIELD
            - INVALID_JWE
            - INVALID_CURSOR_FORMAT
            - USER_NOT_FOUND
            - MERCHANT_ACCOUNT_NOT_FOUND
            - MERCHANT_ACCOUNT_DISCONNECTED
            - SESSION_NOT_FOUND
            - EXTEND_NOT_SUPPORTED
            - MERCHANT_UNAVAILABLE
            - NO_ACCESS
            - TRANSACTION_NOT_FOUND
            - NO_TRANSACTIONS
            - CART_NOT_FOUND
            - FULFILLMENT_NOT_FOUND
          example: INVALID_FIELD
        error_message:
          type: string
          description: Detailed error message.
          example: The limit may not be greater than 10.
  securitySchemes:
    basicAuth:
      type: http
      scheme: basic
      description: >-
        Basic authentication header of the form `Basic <encoded-value>`, where
        `<encoded-value>` is the base64-encoded string `username:password`. Use
        your `client_id` as the `username` and your `secret` as the `password`
        value.

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.knotapi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Switch Card JWE

> Switch a card in a user's merchant account.

<Tip>See code samples [here](/card-switcher/sending-card-data#code-samples) for how to structure and encrypt the JWE in various programming languages.</Tip>

Receiving a successful response from this endpoint means your request has passed validations, including for the `jwe`.


## OpenAPI

````yaml api-reference/openapi.json post /card
openapi: 3.1.0
info:
  title: Knot API
  description: An API to interact with the Knot merchant connectivity platform.
  version: 1.0.0
servers:
  - url: https://development.knotapi.com
    description: Development server
security:
  - basicAuth: []
paths:
  /card:
    post:
      description: Switch a card in a user's merchant account.
      operationId: card_switch
      requestBody:
        description: The input parameters required for switching a card.
        content:
          application/json:
            schema:
              oneOf:
                - title: CardSwitcher
                  type: object
                  properties:
                    jwe:
                      type: string
                      description: JWE value.
                      example: eyJhbGciOiJSU0EtT0FFUC0yNTYiLC...
                    task_id:
                      type: string
                      description: >-
                        `task_id` value provided in the
                        [`AUTHENTICATED`](/link/webhook-events/authenticated)
                        webhook.
                      example: '123456'
                  required:
                    - jwe
                    - task_id
                - title: CardUpdater
                  type: object
                  properties:
                    jwe:
                      type: string
                      description: JWE value.
                      example: eyJhbGciOiJSU0EtT0FFUC0yNTYiLC...
                    external_user_id:
                      type: string
                      description: Your unique identifier for the user.
                      example: abc123
                    merchant_id:
                      type: integer
                      description: Unique identifier for the merchant.
                      example: 46
                    card_name:
                      type: string
                      description: >-
                        Name of the card. Learn more
                        [here](/sdk/ios#customerconfiguration).
                      example: My Credit Card
                    customer_name:
                      type: string
                      description: >-
                        Name of the customer. Learn more
                        [here](/sdk/ios#customerconfiguration).
                      example: John Doe
                  required:
                    - jwe
                    - external_user_id
                    - merchant_id
      responses:
        '200':
          description: >-
            Successful request. Receiving this response means your request has
            passed validations, including the `jwe`.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    description: Success message.
                    example: Success
        '400':
          description: Bad request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                UserFieldRequired:
                  summary: User object field required
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: The user.phone number is required.
                CardNumberNotNumeric:
                  summary: Card number not numeric.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: The card.number must be numeric.
                CardNumberTooLong:
                  summary: Card number too long.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: The card.number is too long for card type.
                CardNumberTooShort:
                  summary: Card number too short.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: The card.number is too short for card type.
                CardNumberInvalid:
                  summary: Card number invalid.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: >-
                      The card.number is invalid and does not pass the Luhn
                      check.
                CVVNotNumeric:
                  summary: CVV not numeric
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: The card.cvv must be numeric.
                CVVTooLong:
                  summary: CVV to long.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: The card.cvv is too long for card type.
                CVVTooShort:
                  summary: CVV to short.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: The card.cvv is too short for card type.
                CVVRequired:
                  summary: CVV is required.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: The card.cvv is required.
                CardExpirationInvalid:
                  summary: Card expiration invalid.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: The card.expiration should be in MM/YYYY or MM/YY format.
                CardExpired:
                  summary: Card expired.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: The card is expired.
                JWEInvalid:
                  summary: JWE invalid.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_JWE
                    error_message: The jwe is invalid.
        '403':
          description: Forbidden request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                NoAccess:
                  summary: No access
                  value:
                    error_type: INVALID_REQUEST
                    error_code: NO_ACCESS
                    error_message: Please contact Knot for access to this endpoint.
components:
  schemas:
    Error:
      type: object
      properties:
        error_type:
          type: string
          description: Type of error.
          enum:
            - INVALID_INPUT
            - INVALID_REQUEST
            - USER_ERROR
            - SESSION_ERROR
            - MERCHANT_ACCOUNT_ERROR
            - MERCHANT_ERROR
            - TRANSACTION_ERROR
            - CART_ERROR
          example: INVALID_REQUEST
        error_code:
          type: string
          description: Error code.
          enum:
            - INVALID_API_KEYS
            - INVALID_FIELD
            - INVALID_JWE
            - INVALID_CURSOR_FORMAT
            - USER_NOT_FOUND
            - MERCHANT_ACCOUNT_NOT_FOUND
            - MERCHANT_ACCOUNT_DISCONNECTED
            - SESSION_NOT_FOUND
            - EXTEND_NOT_SUPPORTED
            - MERCHANT_UNAVAILABLE
            - NO_ACCESS
            - TRANSACTION_NOT_FOUND
            - NO_TRANSACTIONS
            - CART_NOT_FOUND
            - FULFILLMENT_NOT_FOUND
          example: INVALID_FIELD
        error_message:
          type: string
          description: Detailed error message.
          example: The limit may not be greater than 10.
  securitySchemes:
    basicAuth:
      type: http
      scheme: basic
      description: >-
        Basic authentication header of the form `Basic <encoded-value>`, where
        `<encoded-value>` is the base64-encoded string `username:password`. Use
        your `client_id` as the `username` and your `secret` as the `password`
        value.

````


> ## Documentation Index
> Fetch the complete documentation index at: https://docs.knotapi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Switch Card

> Switch a card in a user's merchant account.



## OpenAPI

````yaml api-reference/openapi_secure.json post /card
openapi: 3.1.0
info:
  title: Knot API
  description: An API to interact with the Knot merchant connectivity platform.
  version: 1.0.0
servers:
  - url: https://secure.development.knotapi.com
    description: Development server
security:
  - basicAuth: []
paths:
  /card:
    post:
      description: Switch a card in a user's merchant account.
      operationId: card_switch
      requestBody:
        description: The input parameters required for switching a card.
        content:
          application/json:
            schema:
              oneOf:
                - title: CardSwitcher
                  type: object
                  properties:
                    user:
                      type: object
                      description: ''
                      properties:
                        name:
                          type: object
                          description: ''
                          properties:
                            first_name:
                              type: string
                              maxLength: 255
                              description: User's first name.
                              example: Ada
                            last_name:
                              type: string
                              maxLength: 255
                              description: User's last name.
                              example: Lovelace
                          required:
                            - first_name
                            - last_name
                        phone_number:
                          type: string
                          description: User's phone number in E.164 format.
                          example: '+11234567890'
                        address:
                          type: object
                          description: ''
                          properties:
                            street:
                              type: string
                              maxLength: 46
                              description: First line of the user's billing address.
                              example: 100 Main Street
                            street2:
                              type: string
                              maxLength: 46
                              description: >-
                                Second line of the user's billing address (e.g
                                apt. #).
                              example: '#100'
                            city:
                              type: string
                              maxLength: 32
                              description: City portion of the user's billing address.
                              example: New York
                            region:
                              type: string
                              description: >-
                                Region portion of the user's billing address,
                                usually a state abbreviation. Must be an ISO
                                3166-2 sub-division code.
                              example: NY
                            postal_code:
                              type: string
                              maxLength: 10
                              minLength: 5
                              description: Postal code of the user's billing address.
                              example: '12345'
                            country:
                              type: string
                              description: >-
                                Country portion of the user's billing address.
                                Must be an ISO 3166-1 alpha-2 code.
                              example: US
                          required:
                            - street
                            - city
                            - region
                            - postal_code
                            - country
                      required:
                        - name
                        - phone_number
                        - address
                    card:
                      type: object
                      description: ''
                      properties:
                        number:
                          type: string
                          description: User's valid card number without spaces or hyphens.
                          example: '4242424242424242'
                        expiration:
                          type: string
                          description: >-
                            User's card expiration date. Must be MM/YYYY or
                            MM/YY format (e.g. 08/2027).
                          example: 08/2025
                        cvv:
                          type: string
                          maxLength: 4
                          description: User's card verification value.
                          example: '123'
                      required:
                        - number
                        - expiration
                        - cvv
                    task_id:
                      type: string
                      description: >-
                        `task_id` value provided in the
                        [`AUTHENTICATED`](/link/webhook-events/authenticated)
                        webhook.
                      example: '123456'
                  required:
                    - user
                    - card
                    - task_id
                - title: CardUpdater
                  type: object
                  properties:
                    user:
                      type: object
                      description: ''
                      properties:
                        name:
                          type: object
                          description: ''
                          properties:
                            first_name:
                              type: string
                              maxLength: 255
                              description: User's first name.
                              example: Ada
                            last_name:
                              type: string
                              maxLength: 255
                              description: User's last name.
                              example: Lovelace
                          required:
                            - first_name
                            - last_name
                        phone_number:
                          type: string
                          description: User's phone number in E.164 format.
                          example: '+11234567890'
                        address:
                          type: object
                          description: ''
                          properties:
                            street:
                              type: string
                              maxLength: 46
                              description: First line of the user's billing address.
                              example: 100 Main Street
                            street2:
                              type: string
                              maxLength: 46
                              description: >-
                                Second line of the user's billing address (e.g
                                apt. #).
                              example: '#100'
                            city:
                              type: string
                              maxLength: 32
                              description: City portion of the user's billing address.
                              example: New York
                            region:
                              type: string
                              description: >-
                                Region portion of the user's billing address,
                                usually a state abbreviation. Must be an ISO
                                3166-2 sub-division code.
                              example: NY
                            postal_code:
                              type: string
                              maxLength: 10
                              minLength: 5
                              description: Postal code of the user's billing address.
                              example: '12345'
                            country:
                              type: string
                              description: >-
                                Country portion of the user's billing address.
                                Must be an ISO 3166-1 alpha-2 code.
                              example: US
                          required:
                            - street
                            - city
                            - region
                            - postal_code
                            - country
                      required:
                        - name
                        - phone_number
                        - address
                    card:
                      type: object
                      description: ''
                      properties:
                        number:
                          type: string
                          description: User's valid card number without spaces or hyphens.
                          example: '4242424242424242'
                        expiration:
                          type: string
                          description: >-
                            User's card expiration date. Must be MM/YYYY or
                            MM/YY format (e.g. 08/2027).
                          example: 08/2025
                        cvv:
                          type: string
                          maxLength: 4
                          description: User's card verification value.
                          example: '123'
                      required:
                        - number
                        - expiration
                        - cvv
                    external_user_id:
                      type: string
                      description: Your unique identifier for the user.
                      example: abc123
                    merchant_id:
                      type: integer
                      description: Unique identifier for the merchant.
                      example: 46
                    card_name:
                      type: string
                      description: >-
                        Name of the card. Learn more
                        [here](/sdk/ios#customerconfiguration).
                      example: My Credit Card
                    customer_name:
                      type: string
                      description: >-
                        Name of the customer. Learn more
                        [here](/sdk/ios#customerconfiguration).
                      example: John Doe
                  required:
                    - user
                    - card
                    - external_user_id
                    - merchant_id
      responses:
        '200':
          description: Successful request.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    description: Success message.
                    example: Success
        '400':
          description: Bad request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                UserFieldRequired:
                  summary: User object field required
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_FIELD
                    error_message: The user.phone number is required.
                CardNumberNotNumeric:
                  summary: Card number not numeric.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_FIELD
                    error_message: The card.number must be numeric.
                CardNumberTooLong:
                  summary: Card number too long.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_FIELD
                    error_message: The card.number is too long for card type.
                CardNumberTooShort:
                  summary: Card number too short.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_FIELD
                    error_message: The card.number is too short for card type.
                CardNumberInvalid:
                  summary: Card number invalid.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_FIELD
                    error_message: >-
                      The card.number is invalid and does not pass the Luhn
                      check.
                CVVNotNumeric:
                  summary: CVV not numeric
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_FIELD
                    error_message: The card.cvv must be numeric.
                CVVTooLong:
                  summary: CVV to long.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_FIELD
                    error_message: The card.cvv is too long for card type.
                CVVTooShort:
                  summary: CVV to short.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_FIELD
                    error_message: The card.cvv is too short for card type.
                CardExpirationInvalid:
                  summary: Card expiration invalid.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_FIELD
                    error_message: The card.expiration should be in MM/YYYY or MM/YY format.
                CardExpired:
                  summary: Card expired.
                  value:
                    error_type: INVALID_REQUEST
                    error_code: INVALID_FIELD
                    error_message: The card is expired.
        '401':
          description: Unauthorized request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                AuthFailed:
                  summary: Auth failed
                  value:
                    error_type: INVALID_INPUT
                    error_code: INVALID_API_KEYS
                    error_message: Invalid client_id or secret provided.
        '403':
          description: Forbidden request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                NoAccess:
                  summary: No access
                  value:
                    error_type: INVALID_REQUEST
                    error_code: NO_ACCESS
                    error_message: Please contact Knot for access to this endpoint.
components:
  schemas:
    Error:
      type: object
      properties:
        error_type:
          type: string
          description: Type of error.
          example: INVALID_REQUEST
        error_code:
          type: string
          description: Error code.
          example: INVALID_FIELD
        error_message:
          type: string
          description: Detailed error message.
          example: The user.name.first_name must not be greater than 255 characters.
  securitySchemes:
    basicAuth:
      type: http
      scheme: basic

```` 