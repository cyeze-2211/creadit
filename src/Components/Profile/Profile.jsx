import React, { useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Input,
    Button,
} from "@material-tailwind/react";
import { UserCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        firstName: "Azizbek",
        lastName: "Karimov",
        phone: "+998 90 123 45 67",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setIsEditing(false);
        alert("Ma'lumotlar saqlandi");
    };

    return (
        <div className="min-h-screen flex items-center mt-[20px] justify-center ">
            <Card className="w-full max-w-xl shadow-xl rounded-2xl p-8 bg-white">
                <div className="flex flex-col items-center gap-4 mb-6">
                    <UserCircleIcon className="w-24 h-24 text-blue-400" />
                    <Typography variant="h4" className="text-blue-gray-800 font-bold">
                        Profil Ma'lumotlari
                    </Typography>
                </div>

                <CardBody className="flex flex-col gap-6">
                    <div>
                        <Typography className="mb-1 text-sm text-blue-gray-600">Ism</Typography>
                        {isEditing ? (
                            <Input
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                            />
                        ) : (
                            <Typography className="font-medium">{user.firstName}</Typography>
                        )}
                    </div>

                    <div>
                        <Typography className="mb-1 text-sm text-blue-gray-600">Familiya</Typography>
                        {isEditing ? (
                            <Input
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}
                            />
                        ) : (
                            <Typography className="font-medium">{user.lastName}</Typography>
                        )}
                    </div>

                    <div>
                        <Typography className="mb-1 text-sm text-blue-gray-600">Telefon</Typography>
                        {isEditing ? (
                            <Input
                                name="phone"
                                value={user.phone}
                                onChange={handleChange}
                            />
                        ) : (
                            <Typography className="font-medium">{user.phone}</Typography>
                        )}
                    </div>

                    <div className="mt-4 flex justify-end">
                        {isEditing ? (
                            <Button color="green" onClick={handleSave}>
                                Saqlash
                            </Button>
                        ) : (
                            <Button
                                color="blue"
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2"
                            >
                                <PencilSquareIcon className="w-5 h-5" />
                                Tahrirlash
                            </Button>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
