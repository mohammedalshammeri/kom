
import urllib.request
import urllib.error
import ssl

# Ignore SSL certificate verification for this script
ssl._create_default_https_context = ssl._create_unverified_context

urls = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Toyota.svg/1200px-Toyota.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Nissan_2020_logo.svg/1200px-Nissan_2020_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/1200px-Honda.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/1200px-Ford_logo_flat.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Chevrolet_logo.svg/1200px-Chevrolet_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/GMC_Logo.svg/1200px-GMC_Logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Lexus_logo.svg/1200px-Lexus_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/1200px-Hyundai_Motor_Company_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mitsubishi_logo.svg/2048px-Mitsubishi_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Land_Rover_Logo_%282020%29.svg/1200px-Land_Rover_Logo_%282020%29.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Dodge_logo_2010.svg/1200px-Dodge_logo_2010.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Jeep_logo.svg/1200px-Jeep_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Genesis_Logo.svg/1200px-Genesis_Logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/MG_Cars_logo.svg/1200px-MG_Cars_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Geely_logo_2023.svg/1200px-Geely_logo_2023.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Changan_Automobile_logo.svg/1200px-Changan_Automobile_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Haval_Logo.svg/1200px-Haval_Logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Chery_logo.svg/1200px-Chery_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/1200px-Suzuki_logo_2.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Infiniti_logo.svg/1200px-Infiniti_logo.svg.png"
]

with open('results.txt', 'w', encoding='utf-8') as f:
    f.write(f"{'Status':<10} | {'URL'}\n")
    f.write("-" * 120 + "\n")

    for url in urls:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                status = response.getcode()
                result = f"{status:<10} | {url}\n"
                print(result.strip())
                f.write(result)
        except urllib.error.HTTPError as e:
            result = f"{e.code:<10} | {url}\n"
            print(result.strip())
            f.write(result)
        except Exception as e:
            result = f"{'Error':<10} | {url} ({e})\n"
            print(result.strip())
            f.write(result)
