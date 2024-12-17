import  Monnify  from  'monnify-js';

const monnify = new Monnify(
    process.env.MONNIFY_API_KEY, 
    process.env.MONNIFY_CONTRACT_CODE
)

export default monnify