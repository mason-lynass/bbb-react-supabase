import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../ReactQueryApp";

export default function ResetPw() {
    const [password, setPassword] = useState("");
    const [confirmedPw, setConfirmedPw] = useState("");
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    async function updatePw(event) {
        event.preventDefault();
        setLoading(true);
        if (password !== confirmedPw) {
            alert('Please ensure that both password fields are identical and try again.');
            setLoading(false)
            return
        }
        const { data, error } = await supabase.auth.updateUser({ password })
        if (error) {
            alert(error.error_description || error.message);
        }
        else if (data) {
            navigate("/account");
            alert("password successfully updated")
        }
        setLoading(false);
    };
    return (
        <>
            <form onSubmit={updatePw}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmedPw}
                    required={true}
                    onChange={(e) => setConfirmedPw(e.target.value)}
                />
                <button disabled={loading}>
                    Reset Password
                </button>
            </form>
        </>
    )
}