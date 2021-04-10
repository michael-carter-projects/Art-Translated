"""
/Users/markevans/Documents/Python_Projects/Art_Translate_Machine_Learning/art_translate_test_t3.py
This pulls data out from Google automl and is used by: art_translate_movements_results_v2.py to
match information from: Art_Translate_Art_Movements_10_21_20.csv
"""

from google.cloud import automl

""" -----------------------------------------------------------------------------------------------
given the filepath of an image: returns results given by AutoML model
"""
def get_results_from_automl(filepath):

    project_id = "numeric-polygon-283403"
    model_id   = "ICN2007288218877165568"

    prediction_client = automl.PredictionServiceClient()

    # Get the full path of the model.
    model_full_id = automl.AutoMlClient.model_path(
        project_id, "us-central1", model_id
    )

    # Read the file.
    with open(filepath, "rb") as content_file:
        content = content_file.read()

    image   = automl.Image(image_bytes=content)
    payload = automl.ExamplePayload(image=image)

    # params is additional domain-specific parameters, score_threshold is used to filter the result
    # https://cloud.google.com/automl/docs/reference/rpc/google.cloud.automl.v1#predictrequest
    params = {"score_threshold": "0.5"}

    request = automl.PredictRequest(
        name=model_full_id,
        payload=payload,
        params=params
    )
    response = prediction_client.predict(request=request)

    results = []
    for result in response.payload:
        results.append([result.display_name, result.classification.score])

    return results

    # >>> ImportError: No module named google.cloud
    # https://stackoverflow.com/questions/44397506/importerror-no-module-named-google-cloud
