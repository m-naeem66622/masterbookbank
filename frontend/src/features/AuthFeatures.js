const host = process.env.REACT_APP_SERVER_HOST;

export const signinAdmin = async (data) => {
    console.log(host);
    const url = `${host}/api/auth/admin/signin`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    console.log(response);
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

export const signupUser = async (data) => {
    const url = `${host}/api/auth/user/signup`;
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

    if (response.status === 200) {
        const json = await response.json();
        localStorage.setItem("authToken", json.authToken);
        return true;
    }

    return false;
};

export const authenticateUser = async () => {
    if (localStorage.getItem("authToken")) {
        const url = `${host}/api/auth/user`;
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
