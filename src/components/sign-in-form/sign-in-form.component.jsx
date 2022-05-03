import { useState, useContext } from "react";
import Button from "../button/button.component";
import { UserContext } from "../../contexts/user.contexts";
import { 
    signInWithAccount, 
    signInWithGooglePopup, 
    crearUserDocumentFromAuth 
} from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input.component";
import './sign-in-form.styles.scss'

const defaultFormFields = {
    email: '',
    password: ''
}

const SignInForm = () => {

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;

    const { setCurrentUser } = useContext(UserContext);

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        try {
            const { user } = await signInWithAccount(email, password);
            setCurrentUser(user);
        }
        catch(error){
            if(error.code === 'auth/wrong-password'){
                alert('Invalid username and password combination. ');
            } else {
                console.log(error)
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value});
    };

    const signInWithGoogle = async () => {
        const { user } = await signInWithGooglePopup();
        await crearUserDocumentFromAuth(user);
        setCurrentUser(user);
    };

    return (
        <div className="sign-in-container">
        <h2>I already have an account</h2>
        <span>
            Sign in with your email and password.
        </span>
        <form onSubmit={handleSubmit}>
            <FormInput label="Email" type="email" required onChange={handleChange} name="email" value={email}/>
            <FormInput label="Password" type="password" required onChange={handleChange} name="password" value={password}/>
            <div className="buttons-container">
                <Button type="submit">Sign In</Button>
                <Button type="button" onClick={signInWithGoogle} buttonType="google">Google Sign In</Button>
            </div>
        </form>
    </div>
    )
};

export default SignInForm;