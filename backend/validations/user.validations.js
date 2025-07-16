import validator from 'validator';
const verifyUser = async (data) =>{

    if ([data.name, data.email, data.password].some(field => !field || field.trim === "")) {
       return "All required fields must be provided and non-empty.";
    }

    if(!validator.isLength(data.name, {min: 5, max: 20})){
        return "Name Must Be Between 5-20 characters"
    }

    if(!validator.isEmail(data.email)){
        return "Please Enter A valid Email id";
    }

    if(!validator.isStrongPassword(data.password)){
        return "Please Enter A Storng password"
    }

    return null;
}
export default verifyUser;