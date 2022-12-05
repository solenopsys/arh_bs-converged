import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "hub-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  encapsulation: ViewEncapsulation.Emulated
})
export class LoginComponent implements OnInit {
  email: string;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
  }

  send() {
    console.log("SEND")
    firstValueFrom(this.httpClient.get("http://127.0.0.1:8880/sendmail/" + this.email)).then(res => {
      console.log("RES ",res)
    });
  }
}
