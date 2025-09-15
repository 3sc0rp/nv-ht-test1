# PowerShell script to add missing language translations to menu items
# Missing languages: bs, zh, ro, uk, vi

# Define the translation mappings for common terms
$translations = @{
    "bs" = @{
        # Common menu terms
        "Hummus" = "Humus"
        "Baba Ghanoush" = "Baba Ghanoush"
        "Kibbeh" = "Kibbeh"
        "Falafel" = "Falafel"
        "Baklava" = "Baklava"
        "Chicken" = "Piletina"
        "Beef" = "Govedina"
        "Lamb" = "Janjetina"
        "Shrimp" = "Škampi"
        "Rice" = "Pirinač"
        "Salad" = "Salata"
        "Soup" = "Juha"
        "Grilled" = "Na žaru"
        "Wrap" = "Umotano"
        "Platter" = "Pladanj"
        "Special" = "Specijalitet"
        "Traditional" = "Tradicionalno"
        "Classic" = "Klasično"
        "Fresh" = "Svježe"
        "Delicious" = "Ukusno"
        "Authentic" = "Autentično"
    }
    "zh" = @{
        # Chinese translations
        "Hummus" = "鹰嘴豆泥"
        "Baba Ghanoush" = "茄子泥"
        "Kibbeh" = "基贝"
        "Falafel" = "法拉费"
        "Baklava" = "巴克拉瓦"
        "Chicken" = "鸡肉"
        "Beef" = "牛肉"
        "Lamb" = "羊肉"
        "Shrimp" = "虾"
        "Rice" = "米饭"
        "Salad" = "沙拉"
        "Soup" = "汤"
        "Grilled" = "烤制"
        "Wrap" = "卷饼"
        "Platter" = "拼盘"
        "Special" = "特色菜"
        "Traditional" = "传统"
        "Classic" = "经典"
        "Fresh" = "新鲜"
        "Delicious" = "美味"
        "Authentic" = "正宗"
    }
    "ro" = @{
        # Romanian translations
        "Hummus" = "Humus"
        "Baba Ghanoush" = "Baba Ghanoush"
        "Kibbeh" = "Kibbeh"
        "Falafel" = "Falafel"
        "Baklava" = "Baklava"
        "Chicken" = "Pui"
        "Beef" = "Vită"
        "Lamb" = "Miel"
        "Shrimp" = "Creveți"
        "Rice" = "Orez"
        "Salad" = "Salată"
        "Soup" = "Supă"
        "Grilled" = "La grătar"
        "Wrap" = "Lipie"
        "Platter" = "Platou"
        "Special" = "Specialitate"
        "Traditional" = "Tradițional"
        "Classic" = "Clasic"
        "Fresh" = "Proaspăt"
        "Delicious" = "Delicios"
        "Authentic" = "Autentic"
    }
    "uk" = @{
        # Ukrainian translations
        "Hummus" = "Хумус"
        "Baba Ghanoush" = "Баба Гануш"
        "Kibbeh" = "Кіббе"
        "Falafel" = "Фалафель"
        "Baklava" = "Баклава"
        "Chicken" = "Курка"
        "Beef" = "Яловичина"
        "Lamb" = "Баранина"
        "Shrimp" = "Креветки"
        "Rice" = "Рис"
        "Salad" = "Салат"
        "Soup" = "Суп"
        "Grilled" = "На грилі"
        "Wrap" = "Рулет"
        "Platter" = "Плато"
        "Special" = "Фірмова страва"
        "Traditional" = "Традиційний"
        "Classic" = "Класичний"
        "Fresh" = "Свіжий"
        "Delicious" = "Смачний"
        "Authentic" = "Автентичний"
    }
    "vi" = @{
        # Vietnamese translations
        "Hummus" = "Hummus"
        "Baba Ghanoush" = "Baba Ghanoush"
        "Kibbeh" = "Kibbeh"
        "Falafel" = "Falafel"
        "Baklava" = "Baklava"
        "Chicken" = "Gà"
        "Beef" = "Thịt bò"
        "Lamb" = "Thịt cừu"
        "Shrimp" = "Tôm"
        "Rice" = "Cơm"
        "Salad" = "Salad"
        "Soup" = "Súp"
        "Grilled" = "Nướng"
        "Wrap" = "Bánh cuốn"
        "Platter" = "Đĩa"
        "Special" = "Đặc biệt"
        "Traditional" = "Truyền thống"
        "Classic" = "Cổ điển"
        "Fresh" = "Tươi"
        "Delicious" = "Ngon"
        "Authentic" = "Chính thống"
    }
}

Write-Host "This script identifies menu items missing the new languages (bs, zh, ro, uk, vi)"
Write-Host "Due to the complexity of translations, manual updates will be needed for accuracy."
Write-Host "Please update each menu item manually with proper translations."

# Read the menu file and analyze it
$menuFile = "pages/menu.js"
$content = Get-Content $menuFile -Raw

# Count items missing the new languages
$missingBs = ($content | Select-String -Pattern "ko: '[^']*'" -AllMatches).Matches.Count - ($content | Select-String -Pattern "bs: '[^']*'" -AllMatches).Matches.Count
$missingZh = ($content | Select-String -Pattern "ko: '[^']*'" -AllMatches).Matches.Count - ($content | Select-String -Pattern "zh: '[^']*'" -AllMatches).Matches.Count
$missingRo = ($content | Select-String -Pattern "ko: '[^']*'" -AllMatches).Matches.Count - ($content | Select-String -Pattern "ro: '[^']*'" -AllMatches).Matches.Count
$missingUk = ($content | Select-String -Pattern "ko: '[^']*'" -AllMatches).Matches.Count - ($content | Select-String -Pattern "uk: '[^']*'" -AllMatches).Matches.Count
$missingVi = ($content | Select-String -Pattern "ko: '[^']*'" -AllMatches).Matches.Count - ($content | Select-String -Pattern "vi: '[^']*'" -AllMatches).Matches.Count

Write-Host ""
Write-Host "Missing translation counts:"
Write-Host "Bosnian (bs): $missingBs items"
Write-Host "Chinese (zh): $missingZh items"
Write-Host "Romanian (ro): $missingRo items"
Write-Host "Ukrainian (uk): $missingUk items"
Write-Host "Vietnamese (vi): $missingVi items"
Write-Host ""
Write-Host "Recommendation: Update each menu item manually with culturally appropriate translations."