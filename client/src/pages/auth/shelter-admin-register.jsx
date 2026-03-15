import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, UserPlus, Mail, Lock, MapPin } from "lucide-react";

const ShelterAdminRegister = () => {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        city: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/admin/create-shelter-admin", formData);
            if (response.data.success) {
                toast({
                    title: "Success",
                    description: "Shelter Admin account created successfully!",
                });
                navigate("/auth/login");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Something went wrong",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full shadow-2xl border-none">
                <CardHeader className="bg-indigo-900 text-white rounded-t-xl text-center space-y-2">
                    <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold uppercase tracking-wider text-white">Shelter Admin Registration</CardTitle>
                    <CardDescription className="text-indigo-100 flex items-center justify-center gap-1">
                        <UserPlus className="w-4 h-4" /> Internal Use Only
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-slate-700 font-semibold italic uppercase">
                                <UserPlus className="w-4 h-4" /> Username
                            </Label>
                            <Input 
                                required 
                                placeholder="Admin Name" 
                                value={formData.userName}
                                onChange={(e) => setFormData({...formData, userName: e.target.value})}
                                className="border-slate-200 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-slate-700 font-semibold italic uppercase">
                                <Mail className="w-4 h-4" /> Email Address
                            </Label>
                            <Input 
                                type="email" 
                                required 
                                placeholder="shelter@admin.com" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="border-slate-200 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-slate-700 font-semibold italic uppercase">
                                <Lock className="w-4 h-4" /> Password
                            </Label>
                            <Input 
                                type="password" 
                                required 
                                placeholder="••••••••" 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="border-slate-200 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-slate-700 font-semibold italic uppercase">
                                <MapPin className="w-4 h-4" /> Shelter City
                            </Label>
                            <Select onValueChange={(value) => setFormData({...formData, city: value})} required>
                                <SelectTrigger className="border-slate-200 focus:ring-indigo-500">
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                                    <SelectItem value="Panchkula">Panchkula</SelectItem>
                                    <SelectItem value="Mohali">Mohali</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-[10px] text-slate-400 font-medium italic mt-1">Must match a listed shelter location.</p>
                        </div>

                        <Button 
                            disabled={isLoading}
                            type="submit" 
                            className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-6 rounded-xl transition-all duration-300 transform active:scale-95 shadow-lg"
                        >
                            {isLoading ? "Creating Account..." : "REGISTER SHELTER ADMIN"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ShelterAdminRegister;
