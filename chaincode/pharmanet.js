'use strict';

const {Contract} = require('fabric-contract-api');

class PharmanetContract extends Contract {
    constructor() {
        //Provide a custom name to refer to this smart contract
        super('org.pharma-network.pharmanet.company');
    }

    /* **** All Custom functions are defined below **** */

    //This is a basic user defined function used at the time of instantiating the smart contract.

    // To print the success message on console
    async instantiate(ctx) {
        console.log('Pharmanet Smart Contract Instantiated');
    }

    /**
     * Create a new company account in the network using the registerCompany function. Transporter org which
     * is fedex is not the part of hierarchy and consumer org is not the part of this function.
     * @param ctx - The transaction context object
     * @param companyCRN - Company Registration Number.
     * @param companyName - name of company.
     * @param location - location of comapny.
     * @param organizationRole - whether the company is manufacurer, distributor, retailer, transporter, or consumer.
     * @param hierarchyKey - only three orgs will get hierarchy key.
     */

     async registerCompany (ctx, companyCRN, companyName, location,organisationRole){

         //Create a new composite key to find hierarchy of new company.
         const companyKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company', [companyName,companyCRN]);

         let companyArray = [{'id': sunph_001,'name':'sunpharma', 'role': 'manufacturer', 'hkey':1},{'id': vgph_002,'name': 'vgpharma', 'role': 'distributer','hkey':2},{'id': upg_003,'name': 'upgrad', 'role': 'retailer', 'hkey':3}];

        

         let newCompanyObject = {

             companyID: companyCRN,

             name: companyName,

             location: location,

             organisationRole: organisationRole,

             hierarchyKey: companyArray.hkey,

             createdAt: new Date(),

             updatedAt: new Date()

         }

         //Convert JSON object to buffer and send it to blockchain for storage.
         let dataBuffer = Buffer.from(JSON.stringify(newCompanyObject));
         await ctx.stub.putState(companyKey, dataBuffer);

         //Return value of new account created to user.
         return newCompanyObject;
     }

     /**
      * addDrug() Transaction - This transaction is used by any organisation registered as a ‘manufacturer’ to register a new drug on the ledger.
      * @param drugName - name of the drug
      * @param serialNo - serial number of the drug
      * @param mfgDate - manufacturing date of the drug
      * @param expDate - expiry date
      * @param companyCRN - company regsistration number.
      */

     async addDrug(ctx, drugName, serialNo, mfgDate, expDate, companyCRN){
 
        const companyKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company', companyCRN);
           let companyBuffer = await ctx.stub
                       .getState(companyKey)
                       .catch(err => console.log(err));
           let companyObject = JSON.parse(companyBuffer.toString());
           if(companyObject.hkey === 1){
             
               const productIDKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company', [drugName, serialNo]);
               const manufacturerCompanyKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company',[companyCRN]);
                //const productmanufactureKey=ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company', [productIDKey, manufacturerCompanyKey])
              
                manufacturerCompanyBuffer = await ctx.stub
                               .getState(manufacturerCompanyKey)
                               .catch(err =>console.log(err))
               let manufacturerCompanyObject = JSON.parse(manufacturerCompanyBuffer.toString());
              
               productBuffer = await ctx.stub
                               .getState(productIDKey)
                               .catch(err =>console.log(err))
               let productObject = JSON.parse(productBuffer.toString());
          
                let newDrugObject = {
                    productId:productObject,
                    name: drugName,
                    manufacturer: manufacturerCompanyObject,
                    manufacturingDate: mfgDate,
                    expiryDate: expDate,
                    owner: manufacturerCompanyObject,
                    shipment:null,
                    updatedAt: new Date(),
                    createdAT: new Date()
                };
                let drugObjectBuffer = Buffer.from(JSON.stringify(newDrugObject));
                await ctx.stub.putState(productIDKey, drugObjectBuffer);
                return newDrugObject;
            }
            else{
            throw new Error('Company is not a Manufacturer Company!');
        }
  }


      

}

module.exports = PharmanetContract;

/* regsiterCompany part
         let hierarchyKey;
         for(i=0;i<companyArray.length;i++){

             if(companyArray[i].id === i && companyArray[i].name === companyName){

                 hierarchyKey = companyArray[i].id;

                 companyName = companyArray[i].name;

                 organisationRole = companyArray[i].role;

             }

             else{

                 console.log('Enter valid company id and name');

             }

         }
         */
        /**
       * async createPO(buyerCRN, sellerCRN, drugName, quantity){
          const poKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company', [buyerCRN,drugName]);
          

            let companyBuffer = await ctx.stub
                        .getState(poKey)
                        .catch(err => console.log(err));

        let companyObject = JSON.parse(companyBuffer.toString());
            if(companyObject.companyName === 'vgpharma'  || companyObject.companyName === 'upgrad'){
                let newPoObject = {
              drugName: drugName,
              quantity: quantity,
              buyer: buyerCRN,
              seller: sellerCRN,
              createdAt: new Date(),
              updatedAt: new Date()
            }


        }
      }

      async createShipment (buyerCRN, drugName, listOfAssets, transporterCRN ){
          const shipmentIDKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company',[buyerCRN, drugName]);

         
      }

      async updateShipment(buyerCRN, drugName, transporterCRN){
          const transporterKey = ctx.stub.createCompositeKey('org.pharma-newtork.pharmanet.company',[transporterCRN])j;

          const buyerCompanyKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company',[buyerCRN]);


      }
       */
