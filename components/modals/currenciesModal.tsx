import { useRef, useEffect, useState } from "react";
import { callAPI } from "@/lib/axiosHelper"
import useFetch from '@/hooks/useFetch'
import SVGIcon from '@/components/elements/icons';
import { Icons, Services } from '@/types/enums';
import Currency from "currencies.json";


interface CurrencyProps {
    currency: {
        code: string;
        symbol: string;
        rate: string;
    };
    convertCurrency: (countryCode: string, countrySymbol: string, rate: string) => void;
}

const CurrenciesModal = (props: CurrencyProps) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const [currencies, setCurrencies] = useState(Currency['currencies'])
    const [currenciesRate, setCurrenciesRate] = useState<{ country_code, rate }[]>([])
    const { error, ok, data, loading } = useFetch('/multicurrency-show-all', 'GET')

    useEffect(() => {
        if (!loading && data && ok) {
            setCurrenciesRate(data)
        }
    }, [loading, data, ok])

    const getRate = (countryCode: string): number | undefined => {
        const currency = currenciesRate.find((item) => item.country_code == countryCode);
        return currency ? currency.rate : undefined;
    };

    
    return (
        <div ref={modalRef} className="modal currencies-modal  fade" id="currencies-modal" aria-hidden="true" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 className="change-language__header-title text-dark">Select your currency</h6>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body text-dark">
                        <div className="change-language">
                            <div className="change-language__box">
                                {(currencies?.length) &&
                                    currencies.filter((_, index) => index > -1).map((item, index) => (
                                        <div key={"currenvy-item" + index} className={`change-language__item  ${item.code == props.currency.code && 'active'}`}
                                            onClick={() => props.convertCurrency(item.code, item.symbol, String(getRate(item.code)))}
                                            data-bs-dismiss="modal"
                                            aria-label="Close">
                                            <div className="change-language__item-name ">
                                                <p>{item.name}</p>
                                                <p className="secondary">{item.code}</p>
                                            </div>
                                            {item.code == props.currency.code && <SVGIcon src={Icons.Check} height={24} width={24} />}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CurrenciesModal;

