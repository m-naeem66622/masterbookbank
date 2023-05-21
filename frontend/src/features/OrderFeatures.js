const host = process.env.REACT_APP_SERVER_HOST;

export const placeOrder = async (obj) => {
    const url = `${host}/api/order/create`;
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

export const fetchOrdersAdmin = async () => {
    const url = `${host}/api/order/admin/fetchAll`;
    const options = {
        method: "GET",
        headers: {
            authToken: localStorage.getItem("authToken"),
        },
    };

    const res = await fetch(url, options);
    const json = await res.json();

    return { json, status: res.status };
};

export const fetchOrderAdmin = async (id) => {
    const url = `${host}/api/order/admin/fetch/${id}`;
    const options = {
        method: "GET",
        headers: {
            authToken: localStorage.getItem("authToken"),
        },
    };

    const res = await fetch(url, options);
    const json = await res.json();

    return { json, status: res.status };
};

export const updateOrderAdmin = async (id, orderStatus) => {
    const url = `${host}/api/order/admin/update/${id}`;
    const options = {
        method: "PUT",
        body: JSON.stringify({ orderStatus }),
        headers: {
            authToken: localStorage.getItem("authToken"),
            "Content-Type": "application/json",
        },
    };

    const res = await fetch(url, options);
    const json = await res.json();

    return { json, status: res.status };
};
