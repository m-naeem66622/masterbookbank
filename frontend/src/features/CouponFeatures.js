const host = process.env.REACT_APP_SERVER_HOST;

export const applyCoupon = async (obj) => {
    const url = `${host}/api/coupon/apply`;
    const options = {
        method: "POST",
        headers: {
            authToken: localStorage.getItem("authToken"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    const res = await fetch(url, options);
    const json = await res.json();

    return { json, status: res.status };
};
