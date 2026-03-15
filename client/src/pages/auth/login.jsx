import Commonform from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialState = {
    email: '',
    password: '',
    role: 'user'
};

function AuthLogin() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const { toast } = useToast();
    const navigate = useNavigate();

    function onSubmit(event) {
        event.preventDefault();
        dispatch(loginUser(formData)).then((data) => {
            if (data?.payload?.success) {
                toast({
                    title: data?.payload?.message,
                });
                // Redirect based on role
                if (data.payload.user.role === 'shelterAdmin') {
                    navigate('/shelterAdmin');
                } else {
                    navigate('/');
                }
            } else {
                toast({
                    title: data?.payload?.message,
                    variant: "destructive",
                });
            }
        });
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Don't have an account
                    <Link className="font-medium ml-2 text-primary hover:underline" to='/auth/register'>Register</Link>
                </p>
            </div>

            <Tabs
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="user">User</TabsTrigger>
                    <TabsTrigger value="shelterAdmin">Shelter Admin</TabsTrigger>
                </TabsList>
            </Tabs>

            <Commonform
                formControls={loginFormControls}
                buttonText={'Sign In'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    );
}

export default AuthLogin;