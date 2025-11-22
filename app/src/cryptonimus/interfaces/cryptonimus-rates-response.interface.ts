import {ICryptonimusRate} from "./cryptonimus-rate.interface";

export interface ICryptonimusRatesResponse {
    state: number;
    result: ICryptonimusRate[];
}