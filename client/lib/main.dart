import 'dart:async';
import 'package:dio/dio.dart';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:percent_indicator/linear_percent_indicator.dart';
import 'package:url_launcher/url_launcher.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  int currentProgress = 0;
  late int rowsNumber;
  var isProcessStarted = false, isProcessFinished = false;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: Scaffold(
          body: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              (isProcessStarted)
                  ? const Text(
                      'Please wait for the process to finish',
                      style: TextStyle(fontSize: 30),
                    )
                  : Column(
                      children: [
                        const Padding(
                          padding: EdgeInsets.all(20),
                          child: Text(
                            'Pick the excel file',
                            style: TextStyle(fontSize: 30),
                          ),
                        ),
                        SizedBox(
                          height: 100,
                          width: 250,
                          child: ElevatedButton(
                            child: const Text('Pick file',
                                style: TextStyle(fontSize: 25)),
                            onPressed: () async {
                              FilePickerResult? result =
                                  await FilePicker.platform.pickFiles();

                              if (result != null) {
                                var filePath = result.files.single.path;
                                var formData = FormData.fromMap({
                                  'file': MultipartFile.fromFileSync(filePath!)
                                });
                                Dio().post('http://localhost:8080/file_upload',
                                    data: formData);
                              }

                              // runs every 1 second
                              Timer.periodic(const Duration(seconds: 1),
                                  (timer) {
                                Dio()
                                    .get(
                                        'http://localhost:8080/current_progress')
                                    .then((response) {
                                  setState(() {
                                    currentProgress =
                                        response.data['current_progress'];
                                    rowsNumber = response.data['rows_number'];
                                    if (currentProgress > 0 &&
                                        !isProcessStarted) {
                                      isProcessStarted = true;
                                    }
                                  });

                                  if (currentProgress == rowsNumber) {
                                    timer.cancel();
                                    setState(() {
                                      isProcessFinished = true;
                                    });
                                  }
                                });
                              });
                            },
                          ),
                        ),
                      ],
                    ),
              isProcessStarted
                  ? Padding(
                      padding: const EdgeInsets.all(30),
                      child: LinearPercentIndicator(
                        alignment: MainAxisAlignment.center,
                        lineHeight: 100,
                        width: 1000,
                        center: Text('$currentProgress / $rowsNumber',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 20,
                            )),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        animation: true,
                        animateFromLastPercent: true,
                        barRadius: const Radius.circular(10),
                        backgroundColor: Colors.grey,
                        progressColor:
                            isProcessFinished ? Colors.green : Colors.blue,
                        percent: currentProgress / rowsNumber,
                      ),
                    )
                  : Container(),
              isProcessFinished
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const SizedBox(height: 10),
                        const Text(
                          'Process finished!',
                          style: TextStyle(fontSize: 30),
                        ),
                        const Text(
                          'You can download the result now',
                          style: TextStyle(fontSize: 30),
                        ),
                        const SizedBox(height: 20),
                        SizedBox(
                          height: 100,
                          width: 250,
                          child: ElevatedButton(
                            style:
                                ElevatedButton.styleFrom(primary: Colors.green),
                            child: const Text(
                              'Download',
                              style: TextStyle(fontSize: 30),
                            ),
                            onPressed: () async {
                              var url = Uri.http('localhost:8080', '/download');
                              launchUrl(url);
                            },
                          ),
                        ),
                        const Padding(
                            padding: EdgeInsets.symmetric(vertical: 10)),
                        isProcessFinished
                            ? SizedBox(
                                height: 100,
                                width: 250,
                                child: ElevatedButton(
                                  child: const Text(
                                    'Pick another file',
                                    style: TextStyle(fontSize: 25),
                                  ),
                                  onPressed: () {
                                    setState(() {
                                      isProcessStarted = false;
                                      isProcessFinished = false;
                                      currentProgress = 0;
                                    });
                                  },
                                ),
                              )
                            : Container(),
                      ],
                    )
                  : Container()
            ],
          ),
        ));
  }
}
