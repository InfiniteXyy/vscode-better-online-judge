#include <iostream>
#include <cstring>
#include <algorithm>
using namespace std;

// description: input a, b; output a + b

void solve() {
    int a, b;
    cin >> a >> b;
    cout << (a + b) << endl;
}

int main() {
    int T;
    cin >> T;
    for (int i = 0; i < T; ++i) {
        solve();
    }
    return 0;
}