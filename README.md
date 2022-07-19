# LannisterPay

## About

Implement a transaction payment splitting service (TPSS). The service is meant to calculate the amount due to one or more split payment "entities" as well as the amount left after all splits have been computed.

### Implimentation

The API service expose a single HTTP POST endpoint /split-payments/compute that accepts a transaction object with the following properties:

- `ID` Unique numeric ID of the transaction
- `Amount` Amount to be splitted between the split entities defined in the SplitInfo array (see below)
- `Currency` The currency of the transaction
- `CustomerEmail` Email address of the transaction customer
- `SplitInfo` An array of split entity objects. Each object conatins the fields below:
- `SplitType` This defines how the split amount for the entity is calculated. It has 3 possible values, `"FLAT", "PERCENTAGE" AND "RATIO"`
- - `SplitValue` This is used together with the `SplitType` to determine the final value of the split amount for the entity. Example, a `SplitType` of `FLAT` and SplitValue of `45` means the split entity gets NGN 45. Another example, A `SplitType` of PERCENTAGE and SplitValue of `3` means the split entity gets 3 percent of the transaction amount or Balance. You can read more about split computation under the `Requirement II (Split computation rules)` section.
- - `SplitEntityId` This is the unique identifier for the split entity.

Sample Payload :

> {
> "ID": 1308,
> "Amount": 12580,
> "Currency": "NGN",
> "CustomerEmail": "anon8@customers.io",
> "SplitInfo": [
>
> > {
> > "SplitType": "FLAT",
> > "SplitValue": 45,
> > "SplitEntityId": "LNPYACC0019"
> > },
> > {
> > "SplitType": "RATIO",
> > "SplitValue": 3,
> > "SplitEntityId": "LNPYACC0011"
> > },
> > {
> > "SplitType": "PERCENTAGE",
> > "SplitValue": 3,
> > "SplitEntityId": "LNPYACC0015"
> > }
> > ]
> > }

Sample output:

> {
> "data": {
> "ID": 1308,
> "Balance": 0,
> "SplitBreakdown": [
>
> > {
> > "SplitEntityId": "LNPYACC0019",>
> > "Amount": 45
> > },
> > {
> > "SplitEntityId": "LNPYACC0015",
> > "Amount": 3
> > },>
> > {
> > "SplitEntityId": "LNPYACC0011",
> > "Amount": 3
> > }
> > ]
> > }
> > }

**= Rule 1 =**
Each split calculation is based on the Balance after the previous calculation's done. At the start of the split calculation, `Balance` should be same as the transaction `Amount`. It then subsequently decreases by the value of the split amount computed for each item in the `SplitInfo` array.

**= Rule 2 =**
The order of precedence for the `SplitType` is:

1. `FLAT` types is computed before `PERCENTAGE` OR `RATIO` types
2. `PERCENTAGE` types is computed before `RATIO` types.
3. `RATIO` types would always be computed last.

**What the API Looked out for**

- The `SplitInfo` array can contain a minimum of 1 split entity and a maximum of 20 entities.
- The final `Balance` value in your response cannot be lesser than 0.
- The split `Amount` value computed for each entity cannot be greater than the transaction `Amount`.
- The split `Amount` value computed for each entity cannot be lesser than 0.
- The sum of all split Amount values computed cannot be greated than the transaction `Amount`.
- The API service response time is no more than 80ms (Milliseconds).

### Installing

To test on your local machine

- clone the repository. Run `git clone https://github.com/Jude-adesulu/LannisterPay.git`
- CD into the directory
- open your terminal and run `npm install`

### Run the app

- Run `npm run start`

### Run dev app

- Run `npm run start:dev`

### Run the test cases

- Run `npm run test`
