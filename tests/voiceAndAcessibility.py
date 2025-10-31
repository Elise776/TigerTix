from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()
driver.get("http://localhost:3000")

# 1. Verify mic button accessibility label
mic = driver.find_element(By.ID, "mic-button")
assert mic.get_attribute("aria-label") == "Activate voice input"

# 2. Simulate voice button click
mic.click()
time.sleep(2)
assert "Recording" in driver.page_source

# 3. Test focus order
driver.find_element(By.TAG_NAME, "body").send_keys("\t")
active = driver.switch_to.active_element
print("Focused element:", active.get_attribute("id"))

driver.quit()
