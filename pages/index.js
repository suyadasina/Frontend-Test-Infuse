import Image from 'next/image'

export const getServerSideProps = async () => {
  const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=13.754&longitude=100.5014&hourly=apparent_temperature,weathercode,is_day&daily=weathercode&current_weather=true&timezone=Asia%2FBangkok&forecast_days=1')
  const data = await res.json()
  return { props: { data } }
}

function pad(d){
    return (d < 10) ? '0' + d.toString() : d.toString();
}


function currentDay() {
  const weekday = ["วันอาทิตย์","วันจันทร์","วันอังคาร","วันพุธ","วันพฤหัส","วันศุกร์","วันเสาร์"];
  const d = new Date()
  let thisDay = weekday[d.getDay()]
  return thisDay
}

function currentMonth(){
  const month = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กฤกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤษจิกายน","ธันวาคม"];
  const d = new Date()
  let thisMonth = month[d.getMonth()]
  return thisMonth
}


export default function Home( {data} ) {
  const currentDate = new Date()
  const cDate = pad(currentDate.getDate())
  const cMonth = pad(currentDate.getMonth() + 1)
  const cYear = currentDate.getFullYear()
  const cTime = pad(currentDate.getHours())+":"+"00"
  const cDateTime = cYear +"-" + cMonth +"-"+ cDate + "T" + cTime
  const cDay = currentDay() +"ที่ " + cDate + " " + currentMonth() + " " + cYear
  const cdayTime = data.hourly.is_day.at(data.hourly.time.indexOf(cDateTime))
  const timezone = data.timezone
  const temperature = data.hourly.apparent_temperature.at(data.hourly.time.indexOf(cDateTime))

  
  function indexOfcTime(i){
    if (currentDate.getHours()+i < 24){
      return data.hourly.time.indexOf(cYear +"-" + cMonth +"-"+ cDate + "T" + pad(currentDate.getHours()+i)+":"+"00")
    }else {
      return -1
    }
  } 

  function isdayOfcTime(i){
    if ( currentDate.getHours()+i <= 23 ){
      return data.hourly.is_day.at(indexOfcTime(i))
    }else{
      return
    }
  }

  function splitTimezone(timezone){
    const textArray = timezone.split("/")
    return textArray.at(textArray.length-1)
  }

  function hourlyTime(i){
    if (currentDate.getHours()+i <= 23){
      return pad(currentDate.getHours()+i)+":"+"00"
    }else {
      return "-"
    }
  }

  function hourlyTemp(i){
    if (currentDate.getHours()+i <= 23){
      return data.hourly.apparent_temperature.at(indexOfcTime(i))+data.hourly_units.apparent_temperature
    }else{
      return "-"
    }
  }

  function hourlyWeather(i){
    if(i==0){
      return
    }
  }
  
  const weatherC = data.hourly.weathercode.at(data.hourly.time.indexOf(cDateTime))

  const weatheric = {
    "ท้องฟ้าโปร่ง" : {Image : <Image src="/Sun.svg" width={20} height={20}/>},
    "มีเมฆบางส่วน" : {Image : <Image src="/Cloud Sun 2.svg" width={20} height={20}/>},
    "ฟ้าครึ้ม" : {Image : <Image src="/Clouds.svg" width={20} height={20}/>},
    "มีฝนปรอย" : {Image : <Image src="/Cloud Rain.svg" width={20} height={20}/>},
    "มีฝนตก" : {Image : <Image src="/Cloud Storm.svg" width={20} height={20}/>},
    "ฝนฟ้าคะนอง" : {Image : <Image src="/Cloud Bolt.svg" width={20} height={20}/>},
    "มีหมอก" : {Image : <Image src="/Fog.svg" width={20} height={20}/>},
  }

  const weatherimg = {
    "ท้องฟ้าโปร่ง" : {Image : <Image src="/Sun.svg" width={120} height={120}/>},
    "มีเมฆบางส่วน" : {Image : <Image src="/Cloud Sun 2.svg" width={120} height={120}/>},
    "ฟ้าครึ้ม" : {Image : <Image src="/Clouds.svg" width={120} height={120}/>},
    "มีฝนปรอย" : {Image : <Image src="/Cloud Rain.svg" width={120} height={120}/>},
    "มีฝนตก" : {Image : <Image src="/Cloud Storm.svg" width={120} height={120}/>},
    "ฝนฟ้าคะนอง" : {Image : <Image src="/Cloud Bolt.svg" width={120} height={120}/>},
    "มีหมอก" : {Image : <Image src="/Fog.svg" width={120} height={120}/>},
  }

  const weatherState = {
    0 : {State : "ท้องฟ้าโปร่ง", StateEn : "clearsky"},1 : {State : "ท้องฟ้าโปร่ง", StateEn : "clearsky"}, 2 : {State : "ท้องฟ้าโปร่ง", StateEn : "clearsky"},
    3 : {State : "มีเมฆบางส่วน", StateEn : "partlycloud"}, 4 : {State : "มีเมฆบางส่วน", StateEn : "partlycloud"},
    5 : {State : "ฟ้าครึ้ม", StateEn : "overcast"}, 6 : {State : "ฟ้าครึ้ม", StateEn : "overcast"}, 7 : {State : "ฟ้าครึ้ม", StateEn : "overcast"}, 8 : {State : "ฟ้าครึ้ม", StateEn : "overcast"}, 9 : {State : "ฟ้าครึ้ม", StateEn : "overcast"}, 10 : {State : "ฟ้าครึ้ม", StateEn : "overcast"}, 
    50 : {State : "มีฝนปรอย", StateEn : "drizzle"},
    60 : {State : "มีฝนตก", StateEn : "rain"}, 
    95 : {State : "ฝนฟ้าคะนอง", StateEn : "thunderstorm"},97 : {State : "ฝนฟ้าคะนอง", StateEn : "thunderstorm"},
    40 : {State : "มีหมอก", StateEn : "fog"}
  }

  const cardclass = isNightCard(cdayTime)
  const cardimg = isNightImg(cdayTime)

  function isNightCard(t){
    if( t == 0 ){
      return "nighttime"
    } else {
      return weatherState[weatherC].StateEn
    }
  }

  function isNightImg(t){
    if( t == 0 ){
      return <Image src="/Moon Stars.svg" width={120} height={120}/>
    } else {
      return weatherimg[weatherState[weatherC].State].Image
    }
  }

  function isNightIc(t){
    if( t == 0){
      return <Image src="/Moon Stars.svg" width={20} height={20}/>
    }else if( t >=1 ){
      return weatheric[weatherState[weatherC].State].Image
    }else {
      return 
    }
  }

  return (
    <>
    
      <div class="flex-container">
        
        <div class="flex-item-left">
          <div class={cardclass}>
              <div class="card-container">
                  <div class="card-text-normal">{weatherState[weatherC].State}</div>
                  <div class="card-text-h1">{temperature}{data.hourly_units.apparent_temperature}</div>
                  <div class="card-text-label">{splitTimezone(timezone)}</div>
                  <div class="card-text-normal">{cDay}</div>
              </div>
              <div class="card-img">{cardimg}</div>
          </div>

        </div>
        

        <div class="flex-item-right">
          <div class="forecast-container">
                <div class="flex-forecast-head">พยากรณ์อากาศ</div>

                <div class="flex-forecast-item">
                  <div class="forecasttime">{hourlyTime(0)}</div>
                  <div class="weather-icon">{isNightIc(isdayOfcTime(0))}</div>
                  <div class="forecasttemp">{hourlyTemp(0)}</div>
                </div>

                <div class="flex-forecast-item">
                  <div class="forecasttime">{hourlyTime(1)}</div>
                  <div class="weather-icon">{isNightIc(isdayOfcTime(1))}</div>
                  <div class="forecasttemp">{hourlyTemp(1)}</div>
                </div>

                <div class="flex-forecast-item">
                  <div class="forecasttime">{hourlyTime(2)}</div>
                  <div class="weather-icon">{isNightIc(isdayOfcTime(2))}</div>
                  <div class="forecasttemp">{hourlyTemp(2)}</div>
                </div>   

                <div class="flex-forecast-item">
                  <div class="forecasttime">{hourlyTime(3)}</div>
                  <div class="weather-icon">{isNightIc(isdayOfcTime(3))}</div>
                  <div class="forecasttemp">{hourlyTemp(3)}</div>
                </div>
                  
                <div class="flex-forecast-item">
                  <div class="forecasttime">{hourlyTime(4)}</div>
                  <div class="weather-icon">{isNightIc(isdayOfcTime(4))}</div>
                  <div class="forecasttemp">{hourlyTemp(4)}</div>
                </div>

                <div class="flex-forecast-item">
                  <div class="forecasttime">{hourlyTime(5)}</div>
                  <div class="weather-icon">{isNightIc(isdayOfcTime(5))}</div>
                  <div class="forecasttemp">{hourlyTemp(5)}</div>
                </div>

                <div class="flex-forecast-item">
                  <div class="forecasttime">{hourlyTime(6)}</div>
                  <div class="weather-icon">{isNightIc(isdayOfcTime(6))}</div>
                  <div class="forecasttemp">{hourlyTemp(6)}</div>
                </div>

                <div class="flex-forecast-item">
                  <div class="forecasttime">{hourlyTime(7)}</div>
                  <div class="weather-icon">{isNightIc(-1)}</div>
                  <div class="forecasttemp">{hourlyTemp(7)}</div>
                </div>
          </div>
        </div>

      </div>

    </>
  )
}
