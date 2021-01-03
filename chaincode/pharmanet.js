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
     * 
     * is fedex is not the part of hierarchy and consumer org is not the part of this function.
     * 
     * @param ctx - The transaction context object
     * 
     * @param companyCRN - Company Registration Number.
     * 
     * @param companyName - name of company.
     * 
     * @param location - location of comapny.
     * 
     * @param organizationRole - whether the company is manufacurer, distributor, retailer, transporter, or consumer.
     * 
     * @param hierarchyKey - only three orgs will get hierarchy key.
     */

     async registerCompany (ctx, companyCRN, companyName, location,organisationRole){

         //Create a new composite key to find hierarchy of new company.

         const companyKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company', [companyName,companyCRN]);

         let companyArray = [{'id': sunph_001,'hkey':1},{'id': vgph_002,'hkey':2},{'id': upg_003, 'hkey':3}];

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
      * 
      * @param drugName - name of the drug
      * 
      * @param serialNo - serial number of the drug
      * 
      * @param mfgDate - manufacturing date of the drug
      * 
      * @param expDate - expiry date
      * 
      * @param companyCRN - company regsistration number.
      * 
      */

     async addDrug(ctx, drugName, serialNo, mfgDate, expDate, companyCRN){
 
        const companyKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company.drug', companyCRN);
        
           let companyBuffer = await ctx.stub
                       .getState(companyKey)
                       .catch(err => console.log(err));

           let companyObject = JSON.parse(companyBuffer.toString());

           if(companyObject.hierarchyKey === 1){
             
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
    async createPO (ctx,buyerCRN, sellerCRN, drugName, quantity){

        const buyerCRNKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company', [buyerCRN]);
        
        let buyerBufferObj = await ctx.stub 
                .getState(buyerCRNKey)
                .catch(err => console.log(err));

        let buyerObj = JSON.parse(buyerBufferObj.toString());
        
        const sellerCRNKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company', [sellerCRN]);
        
        let sellerBufferObj = await ctx.stub 
                .getState(sellerCRNKey)
                .catch(err => console.log(err));
        
        let sellerObj = JSON.parse(sellerBufferObj.toString());
     
        if(buyerObj !== sellerObj){

            if(buyerObj.hierarchyKey === 2 && sellerObj.hierarchyKey === 1){
                const purchaseOrderIdKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company.po', [buyerCRN,drugName]);
    
                let purchaseOrderbuffer = await ctx.stub
               .getState(purchaseOrderIdKey)
               .catch(err =>console.log(err))
             
               let poObject = JSON.parse(purchaseOrderbuffer.toString());
             
               let newPOObject = {
                   poID:poObject,
                   drugName: drugName,
                   quantity: quantity,
                   buyer: buyerCRN,
                   seller: sellerCRN,
                   updatedAt: new Date(),
                   createdAT: new Date()
                  };

                  let poObjectBuffer = Buffer.from(JSON.stringify(newPOObject));
                  await ctx.stub.putState(purchaseOrderIdKey, poObjectBuffer);
             
                  return newPOObject;
            }
            else if(buyerObj.hierarchyKey === 3 && sellerObj.hierarchyKey === 2){

                const purchaseOrderIdKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company.po', [buyerCRN,drugName]);
    
                let purchaseOrderbuffer = await ctx.stub
               .getState(purchaseOrderIdKey)
               .catch(err =>console.log(err))
             
               let poObject = JSON.parse(purchaseOrderbuffer.toString());
             
               let newPOObject = {
                   poID:poObject,
                   drugName: drugName,
                   quantity: quantity,
                   buyer: buyerCRN,
                   seller: sellerCRN,
                   updatedAt: new Date(),
                   createdAT: new Date()
                  };

                  let poObjectBuffer = Buffer.from(JSON.stringify(newPOObject));
                  await ctx.stub.putState(purchaseOrderIdKey, poObjectBuffer);
             
                  return newPOObject;
            }

            else{

                throw new Error('Either hierarchy is not maintained or you have not inserted correct buyerCRN and sellerCRN IDs...!')
            }
        }
        else{

                throw new Error('Please enter correct buyerCRN and sellerCRN...!');
        }
    }

    async createShipment (ctx,buyerCRN, drugName, listOfAssets, transporterCRN){

        const shipmentIdKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company.shipment', [buyerCRN,drugName]);
  
        shipmentObjbuffer = await ctx.stub
        .getState(shipmentIdKey)
        .catch(err =>console.log(err))
 
        let shipmentObject = JSON.parse(shipmentObjbuffer.toString());
 
        const creatorKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company.shipment', [transporterCRN]);
  
        creatorKeyObjbuffer = await ctx.stub
                .getState(creatorKey)
                .catch(err =>console.log(err))
 
        let creatorKeyObj = JSON.parse(creatorKeyObjbuffer.toString());
 
        // if(updatedUserObject.status === 'Approved'){
        //Validate listOfAssets
        let poObjectQuntity=shipmentObject.quantity;
        let poObjectId=shipmentObject.poID;
        // validate listOfAssets  --IDs shoud already be registered >> Drug Ids && poObjectQuntity
        if(poObjectQuntity===listOfAssets.length ){
            let newShipmentObject = {

            shipmentID:shipmentObject,
            creator: creatorKeyObj,
            assets: listOfAssets,
            transporter: creatorKeyObj,
            status: 'in-transit', //‘in-transit’ and ‘delivered’.
            updatedAt: new Date(),
            createdAT: new Date()
            };
            let shipmentObjectBuffer = Buffer.from(JSON.stringify(newShipmentObject));

            await ctx.stub.putState(shipmentIdKey, shipmentObjectBuffer);
 
            return newShipmentObject;
        }
        else{
            throw new Error('List of Assests are not valid!');
        }   
    }

    async updateShipment (ctx,buyerCRN, drugName, transporterCRN){

        const shipmentIdKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company.shipment', [buyerCRN,drugName,transporterCRN]);
    
        shipmentObjbuffer = await ctx.stub
                .getState(shipmentIdKey)
                .catch(err =>console.log(err))

        let shipmentListObject = JSON.parse(shipmentObjbuffer.toString());

        const buyerCRNKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company.shipment', [buyerCRN]);
    
        buyerCRNObjbuffer = await ctx.stub
                .getState(buyerCRNKey)
                .catch(err =>console.log(err))

        let buyerCRNKeyObj = JSON.parse(buyerCRNObjbuffer.toString());

        for (var i=0; i < shipmentListObject.length; i++) {
       
            shipmentListObject[i].owner= buyerCRNKeyObj;
            shipmentListObject[i].status='delivered'
        }
            await ctx.stub.putState(shipmentIdKey, shipmentListObject);

            return shipmentListObject;
    }

    async retailDrug (drugName, serialNo, retailerCRN, customerAadhar){

        //Valid ,retailerCRN

        const retailerKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company.retailer', [retailerCRN]);
    
        retailerCRNbjbuffer = await ctx.stub
                    .getState(retailerKey)
                    .catch(err =>console.log(err))
 
        let retailerKeyObject = JSON.parse(retailerCRNbjbuffer.toString());
 
        if(retailerKeyObject.hierarchyKey===3) {    //3rd Level for Retailer
                const drugIdKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company.drug', [drugName,serialNo]);
               
                drugObjbuffer = await ctx.stub
                .getState(drugIdKey)
                .catch(err =>console.log(err))
           
                let drugObject = JSON.parse(drugObjbuffer.toString());
                drugObject.owner=customerAadhar;
               
                await ctx.stub.putState(drugIdKey, drugObject);
                return drugObject;
        }
    }

    async viewHistory (drugName, serialNo) {

        const drugIdKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company.drug', [drugName,serialNo]);
               
                drugObjbuffer = await ctx.stub
                .getHistoryForKey(drugIdKey)
                .catch(err =>console.log(err))
           
                let drugObjectHistory = JSON.parse(drugObjbuffer.toString());
              
                return drugObjectHistory;

    }

    async viewDrugCurrentState (drugName, serialNo){
 
        const drugIdKey = ctx.stub.createCompositeKey('org.pharma-network.pharmanet.company.drug', [drugName,serialNo]);
               
                drugObjbuffer = await ctx.stub
                .getState(drugIdKey)
                .catch(err =>console.log(err))
           
                let drugObject = JSON.parse(drugObjbuffer.toString());
              
                return drugObject;

    }
}

module.exports = PharmanetContract;

