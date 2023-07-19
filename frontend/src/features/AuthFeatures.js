const host = process.env.REACT_APP_SERVER_HOST;

const queryMaker = (params) => {
    var esc = encodeURIComponent;
    var query = Object.keys(params)
        .map((k) => {
            return esc(k) + "=" + esc(params[k]);
        })
        .join("&");
    return query;
};

export const signinAdmin = async (data) => {
    const url = `${host}/api/auth/admin/signin`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(url, options);

    if (response.status === 200) {
        const json = await response.json();
        localStorage.setItem("authToken", json.authToken);
        return true;
    }

    return false;
};

export const authenticateAdmin = async () => {
    if (localStorage.getItem("authToken")) {
        const url = `${host}/api/auth/admin`;
        const options = {
            method: "POST",
            headers: {
                authToken: localStorage.getItem("authToken"),
            },
        };
        const response = await fetch(url, options);

        if (response.status === 200) {
            const json = await response.json();
            return { json: json.data, status: true };
        }
    }

    return { status: false };
};

export const signupUser = async (data, query) => {
    const url = `${host}/api/auth/user/signup?${queryMaker(query)}`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    const json = await response.json();

    return { json, status: response.status };
};

export const updateUser = async (data) => {
    const url = `${host}/api/auth/user/update`;
    const options = {
        method: "PUT",
        headers: {
            authToken: localStorage.getItem("authToken"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    const json = await response.json();

    return { json, status: response.status };
};

export const signinUser = async (data) => {
    const url = `${host}/api/auth/user/signin`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    const json = await response.json();

    return { json, status: response.status };
};

export const authenticateUser = async () => {
    const idToken = localStorage.getItem("idToken");
    if (idToken) {
        const url = `${host}/api/auth/user`;
        const options = {
            method: "POST",
            headers: { idToken },
        };
        const response = await fetch(url, options);
        const json = await response.json();
        return { json, status: response.status };
    }

    return { status: 401 };
};
